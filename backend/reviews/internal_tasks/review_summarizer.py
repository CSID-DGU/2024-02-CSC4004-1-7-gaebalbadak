import json
import re
import os
import django
import openai
from openai import OpenAI
from pydantic import BaseModel

import personal_key
import ssh_manager

# Django 설정 초기화
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db.models import Q
from reviews.models import Review, RestaurantPlatformSummary, Restaurant

# OpenAI API 키 설정
openai.api_key = personal_key.OPENAI_KEY

client = openai.OpenAI(
    api_key=personal_key.OPENAI_KEY
)

def preprocess_text(text):
    """
    리뷰 텍스트가 20자 이상일 경우만 반환합니다.
    """
    return text.strip() if len(text.strip()) >= 20 else None

def summarize_combined_reviews(combined_text):
    """
    OpenAI API를 사용하여 여러 리뷰 텍스트를 요약하는 함수.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "당신은 여러 리뷰 텍스트를 간결하고 명확하게 요약하는 AI입니다."
                },
                {
                    "role": "user",
                    "content": f"다음 리뷰들을 요약해 주세요:\n{combined_text}"
                }
            ]
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None

class SResult(BaseModel):
    summarized_text: str

def analyze_restaurant(combined_text):
    messages = [{"role": "system", "content": "당신은 음식점 리뷰를 요약하는 AI입니다. 여러가지 리뷰들을 제공하면"
                                              "제공된 리뷰들을 요약하여 요약한 내용을 summarized_text에 반환해주세요."
                                              "한국어로 답해주세요."
                                              "요약한 리뷰는 최대 50자가 넘지 않게하고, '해요체'로 답해주세요."}]
    messages.append({"role": "user", "content": combined_text})

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=messages,
        response_format=SResult
    )
    return json.loads(response.choices[0].message.content)['summarized_text']

def summarize_reviews():
    """
    리뷰를 요약하고 RestaurantPlatformSummary 테이블에 저장합니다.
    """
    # 20자 이상의 텍스트를 가진 리뷰 가져오기
    platform_id = 1  # 고정된 platform_id
    restaurants = Restaurant.objects.exclude(
        id__in=RestaurantPlatformSummary.objects.filter(platform_id=platform_id).values_list('restaurant_id', flat=True)
    )

    for restaurant in restaurants:
        reviews = Review.objects.filter(restaurant_id=restaurant.id)

        # 리뷰를 sentiment(감정)별로 분리
        positive_reviews = []
        negative_reviews = []
        neutral_reviews = []

        for review in reviews:
            preprocessed_text = preprocess_text(review.content)
            if not preprocessed_text:
                continue

            if review.ai_sentiment.code == 0:  # 긍정
                positive_reviews.append(preprocessed_text)
            elif review.ai_sentiment.code == 1:  # 부정
                negative_reviews.append(preprocessed_text)
            elif review.ai_sentiment.code == 2:  # 중립
                neutral_reviews.append(preprocessed_text)

        # 각 감정별 리뷰를 합침
        combined_positive = "\n".join(positive_reviews)
        combined_negative = "\n".join(negative_reviews)
        combined_neutral = "\n".join(neutral_reviews)

        # 감정별로 요약 요청
        try:
            if combined_positive:
                positive_summary = analyze_restaurant(combined_positive)
            else:
                positive_summary = None

            if combined_negative:
                negative_summary = analyze_restaurant(combined_negative)
            else:
                negative_summary = None

            if combined_neutral:
                neutral_summary = analyze_restaurant(combined_neutral)
            else:
                neutral_summary = None

            print(f"Positive Summary: {positive_summary}")
            print(f"Negative Summary: {negative_summary}")
            print(f"Neutral Summary: {neutral_summary}")


        # RestaurantPlatformSummary 데이터 삽입
            summary_obj, created = RestaurantPlatformSummary.objects.get_or_create(
                restaurant_id=restaurant.id,
                platform_id=platform_id,
                defaults={
                    "positive_summary": positive_summary or "",
                    "negative_summary": negative_summary or "",
                    "neutral_summary": neutral_summary or "",
                }
            )

            if not created:  # 이미 존재하는 경우 업데이트
                summary_obj.positive_summary = positive_summary or summary_obj.positive_summary
                summary_obj.negative_summary = negative_summary or summary_obj.negative_summary
                summary_obj.neutral_summary = neutral_summary or summary_obj.neutral_summary
                summary_obj.save()

            print(f"Summary saved for restaurant ID {restaurant.id}!")

        except Exception as e:
            print(f"Error during summarization or saving for restaurant ID {restaurant.id}: {e}")

if __name__ == "__main__":
    print("Starting combined review summarization...")
    summarize_reviews()
    print("Review summarization complete.")
