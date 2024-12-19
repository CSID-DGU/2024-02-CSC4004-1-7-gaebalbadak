import os
import django
from matplotlib import pyplot as plt
from sklearn.calibration import CalibratedClassifierCV
from sklearn.decomposition import TruncatedSVD, PCA
from sklearn.manifold import TSNE
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

import ssh_manager

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

import json

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import cross_val_score, KFold, train_test_split
from sklearn.svm import LinearSVC, SVC
from sklearn.pipeline import Pipeline
from konlpy.tag import Okt
from reviews.models import Restaurant, RestaurantPlatformInfo, Platform, Review, ReviewAuthor

# 데이터 로드 함수
def load_data_set():
    with open('fake_reviews.json', 'r', encoding='utf-8') as fake_file:
        fake_reviews = json.load(fake_file)
    with open('true_reviews.json', 'r', encoding='utf-8') as true_file:
        true_reviews = json.load(true_file)
    return true_reviews, fake_reviews

okt = Okt()

def tokenize(text):
    """텍스트를 형태소로 토큰화하는 함수"""
    return okt.morphs(text)

def show_tfidf_features(pipeline, top_n=20):
    # 파이프라인에서 TfidfVectorizer 가져오기
    tfidf = pipeline.named_steps['tfidf']
    # 단어 목록 및 IDF 값 가져오기
    feature_names = tfidf.get_feature_names_out()
    idf_scores = tfidf.idf_

    # IDF 값으로 정렬하여 상위 N개 출력
    sorted_indices = np.argsort(idf_scores)
    top_features = [(feature_names[i], idf_scores[i]) for i in sorted_indices[:top_n]]

    print("TF-IDF에서 가장 중요한 단어:")
    for word, score in top_features:
        print(f"{word}: {score:.2f}")

# 모델 학습 및 저장 함수
def train_and_save_model_with_evaluation(save_path='review_classifier_model.pkl'):
    # 데이터 로드
    true_reviews, fake_reviews = load_data_set()

    # 데이터 준비
    X = true_reviews + fake_reviews
    y = [1] * len(true_reviews) + [0] * len(fake_reviews)

    # 데이터 분리 (학습 데이터와 테스트 데이터)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # TF-IDF 벡터라이저와 SVM 분류기로 파이프라인 구성
    tfidf = TfidfVectorizer(
        tokenizer=tokenize,
        max_df=0.95,
        min_df=2,
        sublinear_tf=True
    )

    # CalibratedClassifierCV를 사용하여 보정된 분류기 생성
    svm = LinearSVC(C=0.3, max_iter=10000, random_state=42)
    calibrated_svm = CalibratedClassifierCV(svm, cv=5)

    pipeline = Pipeline([
        ('tfidf', tfidf),
        ('calibrated_svm', calibrated_svm)
    ])

    # 모델 학습
    pipeline.fit(X_train, y_train)

    # 테스트 데이터로 예측 수행
    y_pred = pipeline.predict(X_test)

    # 성능 평가
    print("모델 평가 결과:")
    print(f"정확도 (Accuracy): {accuracy_score(y_test, y_pred):.2f}")
    print(f"정밀도 (Precision): {precision_score(y_test, y_pred):.2f}")
    print(f"재현율 (Recall): {recall_score(y_test, y_pred):.2f}")
    print(f"F1 점수 (F1 Score): {f1_score(y_test, y_pred):.2f}")
    print("\n세부 평가:")
    print(classification_report(y_test, y_pred, target_names=['가짜 리뷰', '진짜 리뷰']))

    joblib.dump(pipeline, save_path)
    print(f"모델이 '{save_path}'에 저장되었습니다.")

def train_and_save_model_with_evaluation2(save_path='review_classifier_model.pkl'):
    # 데이터 로드
    true_reviews, fake_reviews = load_data_set()

    # 사용자 정의 불용어 리스트 생성
    custom_stop_words = ['버거', '햄버거', '곱창', '치킨', '쌀국수', '스프', '쿠키', '패티', '포케', '꼬치', '제육', '막창', '오징어', '빵',
                         '돈까스', '탕수육', '돈가스', '파스타', '짬뽕', '우동', '냉면', '회', '짜장', '소바', '중국집', '짜장면', '카츠', '카레',
                         '나베', '치즈', '돈카츠', '중식']

    # okt = Okt()
    #
    # def tokenize(text):
    #     tokens = okt.pos(text)
    #     # 고유명사 제외
    #     tokens = [word for word, pos in tokens if pos not in ['Noun']]
    #     return tokens

    # 데이터 준비
    X = true_reviews + fake_reviews
    y = [1] * len(true_reviews) + [0] * len(fake_reviews)

    # 데이터 분리
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # TF-IDF 벡터라이저
    tfidf = TfidfVectorizer(
        tokenizer=tokenize,
        max_df=0.9,   # 상위 10% 빈도 단어 제거
        min_df=5,     # 최소 5번 이상 등장한 단어만 사용
        sublinear_tf=True,
        stop_words=custom_stop_words
    )

    # SVM 분류기 정의
    svm = LinearSVC(C=0.3, max_iter=10000, random_state=42)

    # 파이프라인 생성
    pipeline = Pipeline([
        ('tfidf', tfidf),
        ('svm', svm)
    ])

    # 모델 학습
    pipeline.fit(X_train, y_train)

    # 테스트 데이터로 예측 수행
    y_pred = pipeline.predict(X_test)

    # 성능 평가
    print("모델 평가 결과:")
    print(f"정확도 (Accuracy): {accuracy_score(y_test, y_pred):.2f}")
    print(f"정밀도 (Precision): {precision_score(y_test, y_pred):.2f}")
    print(f"재현율 (Recall): {recall_score(y_test, y_pred):.2f}")
    print(f"F1 점수 (F1 Score): {f1_score(y_test, y_pred):.2f}")
    print("\n세부 평가:")
    print(classification_report(y_test, y_pred, target_names=['가짜 리뷰', '진짜 리뷰']))

    # 특성 중요도 추출
    feature_names = tfidf.get_feature_names_out()
    svm_classifier = pipeline.named_steps['svm']
    coefficients = svm_classifier.coef_[0]
    top_positive_coefficients = np.argsort(coefficients)[-20:]
    top_negative_coefficients = np.argsort(coefficients)[:20]

    print("진짜 리뷰에 영향을 주는 주요 단어들:")
    for i in reversed(top_positive_coefficients):
        print(f"{feature_names[i]}: {coefficients[i]:.4f}")

    print("\n가짜 리뷰에 영향을 주는 주요 단어들:")
    for i in top_negative_coefficients:
        print(f"{feature_names[i]}: {coefficients[i]:.4f}")

def train_and_save_model_with_evaluation3(save_path='review_classifier_model.pkl'):
    true_reviews, fake_reviews = load_data_set()
    # 전체 데이터 준비
    X = true_reviews + fake_reviews
    y = [1] * len(true_reviews) + [0] * len(fake_reviews)

    # TF-IDF 벡터화
    tfidf = TfidfVectorizer(
        tokenizer=tokenize,
        max_df=0.95,
        min_df=2,
        sublinear_tf=True
    )
    X_tfidf = tfidf.fit_transform(X)

    # TruncatedSVD로 차원 축소
    svd = TruncatedSVD(n_components=50, random_state=42)
    X_reduced = svd.fit_transform(X_tfidf)

    # t-SNE로 차원 축소
    tsne = TSNE(n_components=2, random_state=42, n_jobs=1, method='exact')
    X_tsne = tsne.fit_transform(X_reduced)

    # 시각화
    plt.figure(figsize=(12, 8))
    plt.scatter(X_tsne[y == 1, 0], X_tsne[y == 1, 1], label='진짜 리뷰', alpha=0.5)
    plt.scatter(X_tsne[y == 0, 0], X_tsne[y == 0, 1], label='가짜 리뷰', alpha=0.5)
    plt.legend()
    plt.title('t-SNE를 사용한 리뷰 데이터 시각화')
    plt.show()


def predict_reviews_with_confidence(reviews, model_path='review_classifier_model.pkl'):
    # 모델 로드
    loaded_model = joblib.load(model_path)

    # CalibratedClassifierCV 객체 가져오기
    calibrated_svm = loaded_model.named_steps['calibrated_svm']

    # 예측 확률 계산
    probabilities = calibrated_svm.predict_proba(loaded_model.named_steps['tfidf'].transform(reviews))

    # 분류 결과와 신뢰도 계산
    predictions = np.argmax(probabilities, axis=1)  # 확률이 가장 높은 클래스 선택
    confidences = np.max(probabilities, axis=1) * 100  # 가장 높은 확률을 신뢰도로 사용

    # 결과 출력
    # print("리뷰 분류 결과:")
    results = []
    for review, prediction, confidence in zip(reviews, predictions, confidences):
        # predicted_label = "진짜 리뷰" if prediction == 1 else "가짜 리뷰"
        # print(f"리뷰: {review}")
        # print(f"  -> 분류: {predicted_label}, 신뢰도(Confidence): {confidence:.2f}%")
        # print()
        results.append((prediction, confidence))

    return results

def predict_all_reviews():
    restaurants = Restaurant.objects.filter(prediction_accuracy__isnull=True)

    for restaurant in restaurants:
        reviews = Review.objects.filter(restaurant=restaurant)
        if len(reviews) == 0:
            continue
        reviews_text = [review.content for review in reviews]

        predicted_labels = predict_reviews_with_confidence(reviews_text, 'review_classifier_model.pkl')

        cumulated_confidence = 0
        for index, review in enumerate(reviews):
            predicted_label = predicted_labels[index][0]
            confidence = predicted_labels[index][1]
            review.ai_is_true_review = predicted_label
            cumulated_confidence += confidence
            review.save()
            print(f'[{predicted_label}] ({confidence:.2f}%): {review.content}')
        restaurant.prediction_accuracy = cumulated_confidence / len(reviews)
        restaurant.save()
        print()
        print(f"식당 {restaurant.name}의 리뷰 분석이 완료되었습니다.")
        print(f"분석 정확도: {restaurant.prediction_accuracy:.2f}%")
        print()


if __name__ == '__main__':
    try:
        # predict_all_reviews()
        train_and_save_model_with_evaluation3('review_classifier_model2.pkl')
    except KeyboardInterrupt as e:
        print('사용자에 의해 종료되었습니다.')


# train_and_save_model_with_evaluation('review_classifier_model.pkl')