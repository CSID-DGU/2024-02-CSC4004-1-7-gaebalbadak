import ssh_manager
import os
import django
from django.db.models import Count, F

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Review

reviews = Review.objects.filter(restaurant_id = 374)

pos_count = reviews.filter(ai_sentiment=0).count()
net_count = reviews.filter(ai_sentiment = 2).count()
neg_count = reviews.filter(ai_sentiment = 1).count()
total_count = (pos_count + net_count + neg_count)

w_pos = pos_count / total_count
w_net = net_count / total_count
w_neg = neg_count / total_count
ai_score = 100 * w_pos + 60 * w_net + 20 * w_neg

print(f"Positive Reviews: {pos_count}")
print(f"Neutral Reviews: {net_count}")
print(f"Negative Reviews: {neg_count}")
print(f"AI Score: {ai_score}")
#test