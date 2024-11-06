from django.urls import path
from .views import ReviewSummaryAPIView

urlpatterns = [
    path("summary/", ReviewSummaryAPIView.as_view(), name="review-summary"),
]
