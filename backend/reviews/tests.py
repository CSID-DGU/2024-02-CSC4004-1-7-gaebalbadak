from rest_framework.test import APITestCase
from rest_framework import status
from reviews.models import Restaurant, RestaurantType


class FilterRestaurantsByCategoryAPITest(APITestCase):
    def setUp(self):
        """
        테스트에 필요한 초기 데이터 생성
        """
        # RestaurantType 생성
        self.korean_type = RestaurantType.objects.create(id=10, type_name="한식")
        self.chinese_type = RestaurantType.objects.create(id=17, type_name="중식")

        # Restaurant 생성
        Restaurant.objects.create(
            id=1,
            name="서울카츠",
            type=self.korean_type,
            ai_review_score=85.5,
            is_active=True,
            road_address="서울특별시 강남구",
        )
        Restaurant.objects.create(
            id=2,
            name="장충족발",
            type=self.korean_type,
            ai_review_score=90.0,
            is_active=False,
            road_address="서울특별시 중구",
        )
        Restaurant.objects.create(
            id=3,
            name="홍콩반점",
            type=self.chinese_type,
            ai_review_score=75.0,
            is_active=True,
            road_address="서울특별시 서대문구",
        )

    def test_filter_by_category(self):
        """
        특정 카테고리로 필터링 테스트
        """
        url = "/api/restaurants/filter/"  # API 엔드포인트
        data = {"category": 1}  # 한식 카테고리

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)  # 한식 레스토랑은 2개
        self.assertEqual(response.data["results"][0]["name"], "장충족발")  # 높은 점수 순
        self.assertEqual(response.data["results"][1]["name"], "서울카츠")

    def test_no_category_all_restaurants(self):
        """
        카테고리를 지정하지 않았을 때 모든 레스토랑 반환
        """
        url = "/api/restaurants/filter/"
        data = {}  # 카테고리 미지정

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 3)  # 모든 레스토랑 반환
