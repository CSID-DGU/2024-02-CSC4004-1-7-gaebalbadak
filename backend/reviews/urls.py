from django.urls import path

from reviews.views import AutoCompleteAPIView, FilterRestaurantsByCategoryAPIView

urlpatterns = [
    path('api/autoComplete/', AutoCompleteAPIView.as_view(), name='autocomplete'),
    path('api/restaurants/filter/', FilterRestaurantsByCategoryAPIView.as_view(), name='filter_restaurants'),
]
