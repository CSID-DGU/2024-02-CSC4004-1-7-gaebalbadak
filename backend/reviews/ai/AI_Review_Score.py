import ssh_manager
import os
import django
from django.db.models import Avg, Count, Q, F

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Restaurant, Review


def calculate_ai_scores():
    # 전체 식당의 평점 평균 계산
    overall_avg_rating = \
    Restaurant.objects.aggregate(overall_avg=Avg('review__score', filter=Q(review__score__isnull=False)))['overall_avg']

    # 각 식당별로 R_avg 계산 (null 값은 제외)
    restaurant_scores = Restaurant.objects.annotate(
        avg_score=Avg('review__score', filter=Q(review__score__isnull=False))
    )


    ai_scores = {}

    for restaurant in restaurant_scores:
        R_avg = restaurant.avg_score if restaurant.avg_score is not None else overall_avg_rating
        R_scaled = (R_avg - 1) / 4 * 100



        sentiment_counts = Review.objects.filter(restaurant_id=restaurant.id).values('ai_sentiment').annotate(
            count=Count('id')
        ).order_by()

        N_total = sum(item['count'] for item in sentiment_counts)
        N_pos = next((item['count'] for item in sentiment_counts if item['ai_sentiment'] == 0), 0)
        N_neu = next((item['count'] for item in sentiment_counts if item['ai_sentiment'] == 2), 0)


        review_counts = Review.objects.filter(restaurant_id=restaurant.id).aggregate(
            fake_count=Count('id', filter=Q(ai_is_true_review=False)),
            true_count=Count('id', filter=Q(ai_is_true_review=True))
        )

        P = review_counts['fake_count'] / (review_counts['true_count'] + review_counts['fake_count']) if (review_counts[
                                                                                                              'true_count'] +
                                                                                                          review_counts[
                                                                                                              'fake_count']) > 0 else 1

        if N_total > 0:
            S = (N_pos + 0.5 * N_neu) / N_total * 100
            a = 0.7

        else:
            S = 0
            a = 1.0
            R_avg = 0

        A = restaurant.prediction_accuracy / 100 if restaurant.prediction_accuracy is not None else 1.0



        AI_Score = 0.5 * (R_scaled + S) * (1 - P * A * a)
        ai_scores[restaurant.id] = AI_Score

        restaurant.average_rating = R_avg
        restaurant.ai_review_score = AI_Score
        restaurant.save()

        print(f'Restaurant ID: {restaurant.id}, Average Rating: {R_avg}, AI Score: {AI_Score}')

    return ai_scores

calculate_ai_scores()
