from django.urls import path

from reviews.views import AutoCompleteAPIView, FilterRestaurantsByCategoryAPIView, RestaurantDetailAPIView


urlpatterns = [
    path('api/autoComplete/', AutoCompleteAPIView.as_view(), name='autocomplete'),
    path('api/restaurants/filter/', FilterRestaurantsByCategoryAPIView.as_view(), name='filter_restaurants'),
    path("api/restaurants/<int:restaurant_id>/details/", RestaurantDetailAPIView.as_view(), name="restaurant_detail"),
]
