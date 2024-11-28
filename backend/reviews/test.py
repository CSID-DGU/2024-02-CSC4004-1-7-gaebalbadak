import os

import django
import ssh_manager

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Review, Restaurant, RestaurantPlatformInfo, Platform

reviews = Review.objects.filter(author__platform=Platform.objects.get(id=4))
reviews = [review for review in reviews if review.selected_menu.__contains__('리뷰') or review.selected_menu.__contains__('이벤트')]

for i, review in enumerate(reviews):
    print(f'{i+1}. {review.selected_menu} / {review.content}\n')