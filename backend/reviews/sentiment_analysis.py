import ssh_manager
import os
import django
from django.db import connection
from django.db.utils import OperationalError
from django.db.models import Q

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from konlpy.tag import Okt
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score, classification_report

from reviews.models import Review
from reviews.models import Sentiment

# DB 연결 및 타임아웃 설정
try:
    with connection.cursor() as cursor:
        cursor.execute("SET SESSION wait_timeout=600, interactive_timeout=600")
except OperationalError as e:
    print(f"Database connection error: {e}")
    exit(1)

# 데이터 로드 및 배치 처리
batch_size = 1000
reviews = Review.objects.filter(manual_sentiment_label_attempted=True).only('content', 'manual_sentiment_id')
texts, targets = [], []
for i in range(0, reviews.count(), batch_size):
    batch = reviews[i:i + batch_size]
    texts.extend([review.content for review in batch])
    targets.extend([review.manual_sentiment_id for review in batch])

texts = [review.content for review in reviews]
targets = [review.manual_sentiment_id for review in reviews]

train_texts, test_texts, train_targets, test_targets = train_test_split(
     texts, targets, test_size=0.2, random_state=42)

clean_data = [(text, target) for text, target in zip(train_texts, train_targets) if target is not None]
train_texts, train_targets = zip(*clean_data)
train_targets = list(map(int, train_targets))  # 정수형 변환





#형태소 분석
okt = Okt()
train_tokens = [" ".join(okt.morphs(text)) for text in train_texts]
test_tokens = [" ".join(okt.morphs(text)) for text in test_texts]

# 벡터화
vectorizer = CountVectorizer()
X_train = vectorizer.fit_transform(train_tokens)
X_test = vectorizer.transform(test_tokens)

from imblearn.over_sampling import SMOTE

# SMOTE 적용
smote = SMOTE(random_state=42)
X_train_resampled, train_targets_resampled = smote.fit_resample(X_train, train_targets)

# 모델 학습
model = MultinomialNB()
# model.fit(X_train, train_targets)
model.fit(X_train_resampled, train_targets_resampled)

# 테스트 데이터 예측
predictions = model.predict(X_test)

# 결측값 제거
clean_data = [(true, pred) for true, pred in zip(test_targets, predictions) if true is not None and pred is not None]
test_targets, predictions = zip(*clean_data)
test_targets = list(map(int, test_targets))
predictions = list(map(int, predictions))



# 결과 평가
print("정확도:", accuracy_score(test_targets, predictions))
print(classification_report(test_targets, predictions))

# 무작위 리뷰 데이터 분류 및 감정별 개수 카운트
all_reviews = Review.objects.all()  #리뷰 데이터 전체
all_texts = [review.content for review in all_reviews]
all_tokens = [" ".join(okt.morphs(text)) for text in all_texts]
X_all = vectorizer.transform(all_tokens)

# 예측
all_predictions = model.predict(X_all)

# 감정별 개수 계산
positive_count = sum(1 for p in all_predictions if p == 0)
negative_count = sum(1 for p in all_predictions if p == 1)
neutral_count = sum(1 for p in all_predictions if p == 2)


print("긍정 리뷰 개수:", positive_count)
print("중립 리뷰 개수:", neutral_count)
print("부정 리뷰 개수:", negative_count)



# Sentiment 객체 매핑
sentiment_map = {sentiment.code: sentiment for sentiment in Sentiment.objects.all()}

#DB에 분석 데이터 저장
for review, prediction in zip(all_reviews, all_predictions):
    sentiment = sentiment_map.get(prediction)
    if sentiment:  # Sentiment 객체가 존재하는 경우에만 업데이트
        review.ai_sentiment = sentiment
        review.manual_true_label_attempted = True
        review.save(update_fields=['ai_sentiment','manual_true_label_attempted'])

print("모든 리뷰 데이터의 감정 분석 값이 저장되었습니다.")




