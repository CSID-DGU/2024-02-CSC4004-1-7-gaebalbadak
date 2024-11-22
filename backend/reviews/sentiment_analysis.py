import ssh_manager
import os
import django
from django.db.models import Q

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from konlpy.tag import Okt
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score, classification_report

from reviews.models import Review

reviews = Review.objects.filter(Q(manual_sentiment_label_attempted=True))[:4991]

# for review in reviews:
#     texts = review.content[:4991]
#     train_texts = texts[:3000]
#     test_texts = texts[3000:4991]
#
#     train_targets = review.manual_sentiment[:3000]
#     test_targets = review.manual_sentiment[3000:4991]
#
#
#
# #print(train_texts)
# #print(test_texts)
#
# #형태소 분석
# okt = Okt()
# train_tokens = [" ".join(okt.morphs(text)) for text in train_texts]
# test_tokens = [" ".join(okt.morphs(text)) for text in test_texts]
#
# # 벡터화
# vectorizer = CountVectorizer()
# X_train = vectorizer.fit_transform(train_tokens)
# X_test = vectorizer.transform(test_tokens)
#
# # 모델 학습
# model = MultinomialNB()
# model.fit(X_train, train_targets)
#
# # 테스트 데이터 예측
# predictions = model.predict(X_test)
#
# # 결과 평가
# print("정확도:", accuracy_score(test_targets, predictions))
# print(classification_report(test_targets, predictions))
#
# # 무작위 리뷰 데이터 분류 및 감정별 개수 카운트
# random_reviews = Review.objects.filter(restaurant_id=1)[20:300]  # 30개의 임의 리뷰
# random_texts = [review.content for review in random_reviews]
# random_tokens = [" ".join(okt.morphs(text)) for text in random_texts]
# X_random = vectorizer.transform(random_tokens)
#
# # 예측
# random_predictions = model.predict(X_random)
#
# # 감정별 개수 계산
# positive_count = sum(1 for p in random_predictions if p == 1)
# neutral_count = sum(1 for p in random_predictions if p == 0)
# negative_count = sum(1 for p in random_predictions if p == -1)
#
# print("긍정 리뷰 개수:", positive_count)
# print("중립 리뷰 개수:", neutral_count)
# print("부정 리뷰 개수:", negative_count)