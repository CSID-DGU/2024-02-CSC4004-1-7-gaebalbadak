import ssh_manager
import os
import django
from django.db.models import Avg, Count, Q

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Restaurant, Review

def calculate_ai_scores():
    # 각 식당별로 R_avg 계산 (null 값은 제외) 및 식당의 모든 정보 접근 가능하게 설정
    restaurant_scores = Restaurant.objects.annotate(
        avg_score=Avg('review__score', filter=Q(review__score__isnull=False))
    )

    # AI 점수 계산을 위한 결과를 저장할 딕셔너리
    ai_scores = {}

    for restaurant in restaurant_scores:
        if restaurant.avg_score is not None:
            # R_scaled 계산
            R_avg = restaurant.avg_score
            R_scaled = (R_avg - 1) / 4 * 100

            # S 계산: 각 감정별 리뷰 수를 기반으로 함
            sentiment_counts = Review.objects.filter(restaurant_id=restaurant.id).values('ai_sentiment').annotate(
                count=Count('id')
            ).order_by()

            N_total = sum(item['count'] for item in sentiment_counts)  # 전체 리뷰 수
            N_pos = next((item['count'] for item in sentiment_counts if item['ai_sentiment'] == 0), 0)  # 긍정 리뷰 수
            N_neu = next((item['count'] for item in sentiment_counts if item['ai_sentiment'] == 2), 0)  # 중립 리뷰 수

            # 가짜 리뷰와 진짜 리뷰의 수 계산
            review_counts = Review.objects.filter(restaurant_id=restaurant.id).aggregate(
                fake_count=Count('id', filter=Q(ai_is_true_review=False)),
                true_count=Count('id', filter=Q(ai_is_true_review=True))
            )

            # 가짜 리뷰 비율 P 계산
            P = review_counts['fake_count'] / (review_counts['true_count'] + review_counts['fake_count']) if (review_counts['true_count'] + review_counts['fake_count']) > 0 else 0

            if N_total > 0:
                S = (N_pos + 0.5 * N_neu) / N_total * 100

            A = restaurant.prediction_accuracy / 100 if restaurant.prediction_accuracy is not None else 0.9
            a = 0.7  # 예시 값

            # 최종 AI Score 계산
            AI_Score = 0.5 * (R_scaled + S) * (1 - P * A * a)
            ai_scores[restaurant.id] = AI_Score

    return ai_scores

# 결과 확인
ai_scores = calculate_ai_scores()
for restaurant_id, score in ai_scores.items():
    print(f'Restaurant ID: {restaurant_id}, AI Score: {score}')
