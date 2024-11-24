from django.urls import path

from reviews.views import AutoCompleteAPIView

urlpatterns = [
    path('api/autoComplete/', AutoCompleteAPIView.as_view(), name='autocomplete'),
]
