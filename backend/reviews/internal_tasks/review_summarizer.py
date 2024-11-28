import re
import os
import django
import openai
from django.db.models import Q
from openai import OpenAI

import personal_key
from reviews.models import Review, RestaurantPlatformSummary

# Django 설정 초기화
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# OpenAI API 키 설정
client = OpenAI(
    api_key=personal_key.OPENAI_KEY,
)

def preprocess_text(text):
    """
    리뷰 텍스트가 20자 이상일 경우만 반환합니다.
    """
    return text.strip() if len(text.strip()) >= 20 else None


def summarize_review_text(text):
    """
    OpenAI API를 사용하여 리뷰 텍스트를 요약하는 함수.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": f"{text}를 요약해주세요."}
            ],
            max_tokens=100,
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None


def summarize_reviews():
    """
    리뷰를 요약하고 RestaurantPlatformSummary 테이블에 저장합니다.
    """
    # 20자 이상의 텍스트를 가진 리뷰만 가져오기
    reviews = Review.objects.filter(~Q(content=None) & Q(ai_sentiment__isnull=False))

    for review in reviews:
        # 텍스트 전처리
        preprocessed_text = preprocess_text(review.content)
        if not preprocessed_text:
            continue

        try:
            # AI 요약 생성
            summary_text = summarize_review_text(preprocessed_text)

            if not summary_text:
                print(f"Skipping review ID {review.id} due to empty summary.")
                continue

            # sentiment에 따른 필드 매핑
            if review.ai_sentiment == 0:  # 긍정
                field_to_update = "positive_summary"
            elif review.ai_sentiment == 1:  # 부정
                field_to_update = "negative_summary"
            else:  # 중립
                field_to_update = "neutral_summary"

            # 기존 요약 데이터를 가져오기 (없으면 빈 값으로 초기화)
            summary_data = {
                "positive_summary": "",
                "negative_summary": "",
                "neutral_summary": ""
            }

            # RestaurantPlatformSummary 데이터 가져오기 또는 생성
            summary_obj, created = RestaurantPlatformSummary.objects.get_or_create(
                restaurant_id=review.restaurant_id,
                platform_id=review.platform_id,
                defaults=summary_data
            )

            # 선택된 필드에 요약 텍스트 업데이트
            setattr(summary_obj, field_to_update, summary_text)
            summary_obj.save()

            print(f"Review ID {review.id}: {field_to_update} updated successfully!")

        except Exception as e:
            print(f"Error processing review ID {review.id}: {e}")


if __name__ == "__main__":
    print("Starting review summarization...")
    summarize_reviews()
    print("Review summarization complete.")
