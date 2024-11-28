import json
import os
from typing import List

import django
import ssh_manager
from reviews.internal_tasks.sentiment_labeler import SentimentResult

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()


from django.db.models import Q
from openai import OpenAI
from pydantic import BaseModel

import personal_key
from reviews.models import Restaurant, RestaurantPlatformInfo, Platform, Review

client = OpenAI(
    api_key=personal_key.OPEN_AI_API_KEY,
)


class IncentivizedResult(BaseModel):
    is_incentivized_review: bool
    based_text: str

class IncentivizedListResult(BaseModel):
    sentiments: List[IncentivizedResult]  # 각 감정 결과를 SentimentResult 모델로 정의

def analyze_reviews(reviews):
    messages = [{"role": "system", "content": "당신은 음식점에 작성된 리뷰에 기재된 '주문한 메뉴' 목록을 보고"
                                              "해당 리뷰가 리뷰 작성을 대가로 추가적인 서비스를 제공받았는지 여부를 파악하는"
                                              "AI입니다."
                                              "'가성비갑', '리뷰이벤트', '포토리뷰'와 같은 항목은 해당 이름의 메뉴를 주문함으로써"
                                              "대가를 제공받았음을 의미합니다."
                                              "하지만 메뉴명이 '가성비'인 경우가 아닌, '가성비'라는 단어가 포함된 음식 메뉴라면 대가성 리뷰가 아닙니다."
                                              "리뷰가 대가성 리뷰라고 판단되면 is_incentivized_review 값으로 True를, 아니라면 False를 반환해주세요."
                                              "또한 대가성 리뷰라고 판단했다면 그 판단의 근거가 된 메뉴를 based_text로 반환해주세요."}]

    review_menus_str = ''
    for index, review in enumerate(reviews):
        review_menus_str += f'{index}. {review.selected_menu}\n\n'
    review_menus_str = review_menus_str.strip()

    messages.append({"role": "user", "content": review_menus_str})

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=messages,
        response_format=IncentivizedListResult
    )
    message = response.choices[0].message
    content = message.content
    data = json.loads(content)
    return data

def analyze_and_store_reviews(reviews):
    data = json.loads(analyze_reviews(reviews).content)
    print(json.dumps(data, indent=4, ensure_ascii=False))


def analyze_and_store_all_reviews():
    reviews = Review.objects.filter(
        Q(selected_menu__isnull=False) & Q(manual_true_label_attempted=0)
    ).order_by('?')

    batch_size = 25
    total_reviews = len(reviews)  # QuerySet 전체 개수 계산
    offset = 0  # 시작점

    while offset < total_reviews:
        # 30개씩 꺼내오되, 남은 데이터가 30개 미만일 경우 나머지를 가져옴
        selected_reviews = reviews[offset:offset + batch_size]
        result = analyze_reviews(selected_reviews)

        # 분석 결과 출력
        for i in range(len(selected_reviews)):
            print(f'{i + 1}. {selected_reviews[i].restaurant.name}')
            print(result['sentiments'][i]['is_incentivized_review'])
            print(selected_reviews[i].selected_menu, '>>', result['sentiments'][i]['based_text'])
            print()

        # offset을 batch_size만큼 증가
        offset += batch_size

        # 모든 데이터를 처리했다면 종료
        if len(selected_reviews) < batch_size:
            break

if __name__ == '__main__':
    # analyze_reviews()
    analyze_and_store_all_reviews()
