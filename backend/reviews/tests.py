from rest_framework.test import APITestCase
from rest_framework import status
from .models import Restaurant

class AutoCompleteAPITestCase(APITestCase):
    def setUp(self):
        Restaurant.objects.create(name="서울카츠 충무로본점", is_active=True)
        Restaurant.objects.create(name="서울털보", is_active=True)
        Restaurant.objects.create(name="서울바나나커피 을지로4가점", is_active=True)
        Restaurant.objects.create(name="서울돈까스", is_active=True)
        Restaurant.objects.create(name="서울삼겹오리", is_active=True)

    def test_autocomplete_success(self):
        response = self.client.get("/api/autoComplete/?query=서울")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("서울카츠 충무로본점", response.data)

    def test_autocomplete_no_query(self):
        response = self.client.get("/api/autoComplete/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "검색어를 입력해주세요.")

    def test_autocomplete_empty_result(self):
        response = self.client.get("/api/autoComplete/?query=부산")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
