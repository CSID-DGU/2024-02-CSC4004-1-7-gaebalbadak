from django.urls import path
from reviews.views import TestAPIView

urlpatterns = [
    path("test/", TestAPIView.as_view()),
]
