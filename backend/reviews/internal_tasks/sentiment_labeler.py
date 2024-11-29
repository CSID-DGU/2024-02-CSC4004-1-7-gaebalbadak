import json
import os
from typing import List

import django
from django.db.models import Q

import personal_key

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Review, Sentiment
from openai import OpenAI
from pydantic import BaseModel


client = OpenAI(
    api_key=personal_key.OPEN_AI_API_KEY,
)

class SentimentResult(BaseModel):
    sentiment: int
    confidence: float

class SentimentLabelResponse(BaseModel):
    response_size: int
    sentiments: List[SentimentResult]  # 각 감정 결과를 SentimentResult 모델로 정의

def get_gpt_sentiments(reviews):
    messages = [{"role": "system", "content": "당신은 리뷰 데이터를 분석하여 리뷰가 긍정적, 부정적, 또는 중립적인지를 판단하는 AI입니다. \
                    판단 기준은 다음과 같습니다: \
                    긍정적인 의견은 0, 부정적인 의견은 1, 중립적인 의견은 2로 분류합니다. \
                    사용자의 리뷰와 함께 제공된 별점을 참고하여 감정을 판단하세요. 별점이 없는 경우도 있지만, 없는 별점이 감정의 강도를 나타내는 것은 아닙니다. \
                    응답에는 분류한 감정의 정확도를 나타내는 confidence 값을 포함해주세요."}]
    user_content = ""
    for index, review in enumerate(reviews):
        user_content += f"{index+1}. 리뷰: {review.content} 별점: {review.score}\n\n"
    messages.append({"role": "user", "content": user_content})

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=messages,
        response_format=SentimentLabelResponse
    )
    return response.choices[0].message

def analyze_and_store_sentiments(size=30):
    reviews = Review.objects.filter(manual_sentiment_label_attempted=False)[:size]
    print(len(reviews))
    sentiments = get_gpt_sentiments(reviews)
    data = json.loads(sentiments.content)

    print(sentiments)
    print(data['sentiments'])
    print(len(data['sentiments']))

    for i, sentiment in enumerate(data['sentiments']):
        print(f'{i+1}. ({reviews[i].score}) {reviews[i].content}\n{sentiment}\n')
        confidence = float(sentiment['confidence'])

        if confidence >= 0.8:
            reviews[i].manual_sentiment = Sentiment.objects.get(code=sentiment['sentiment'])
        reviews[i].manual_sentiment_label_attempted = True
        reviews[i].save()

def reset():
    reviews = Review.objects.filter(Q(manual_sentiment__isnull=False))
    for review in reviews:
        review.manual_sentiment = None
        review.save()
    print(f'{len(reviews)}개의 리뷰 라벨링 데이터 초기화')

def analyze_and_store_sentiments_all():
    count = 0
    while count < 23:
        analyze_and_store_sentiments()
        count += 1
        print(f'{count}번째 라벨링 완료')

if __name__ == '__main__':
    analyze_and_store_sentiments_all()
    # reset()