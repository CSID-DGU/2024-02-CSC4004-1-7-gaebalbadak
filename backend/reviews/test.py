import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

import ssh_manager

from reviews.models import Review, Restaurant, RestaurantPlatformInfo, Platform

# 리뷰 가져오기 (최대 100개)
reviews = Review.objects.all()

# 조건을 만족하는 리뷰 필터링
filtered_reviews = [review for review in reviews if len(review.content) >= 20]

# 조건에 해당하는 리뷰 수 출력
print(f"리뷰 총 {len(filtered_reviews)}개가 조건에 해당합니다.")