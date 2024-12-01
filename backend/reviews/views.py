from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from reviews.models import Restaurant, RestaurantPlatformSummary


#main page
#자동 완성 기능 API
class AutoCompleteAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')  # 쿼리 파라미터에서 'query' 가져오기
        if not query:
            return Response({"error": "검색어를 입력해주세요."}, status=HTTP_400_BAD_REQUEST)

        # 검색어로 시작하는 이름을 가나다 순으로 정렬하고 이름과 ID를 반환
        results = (
            Restaurant.objects.filter(name__startswith=query)
            .order_by("name")  # 이름을 가나다 순으로 정렬
            .values("id", "name")[:10]  # 최대 10개의 결과 (ID와 이름 포함)
        )

        # 검색 결과를 리스트로 반환
        return Response({"results": list(results)}, status=HTTP_200_OK)


#filter page
#필터 기능
# 미리 정의된 분류 데이터
CATEGORY_MAP = {
    1: [38, 84, 11, 22, 65, 71, 102, 34, 56, 72, 83, 115, 97, 82, 3, 33, 37, 93, 125, 86, 94, 64, 28, 10, 100, 79,
        16, 90, 1, 29, 92, 6, 137, 127, 94, 139],
    2: [17, 30, 128, 1, 92],
    3: [26, 101, 60, 8, 131, 61, 47, 1, 92],
    4: [24, 23, 62, 80, 134, 99],
    5: [113, 32, 33, 51, 36, 40, 12, 132, 48, 126],
    6: [106, 18, 19, 21, 130, 53, 54, 27, 103],
    7: [123, 46, 69, 77, 44, 88, 74, 41, 63, 50, 49],
    8: [135, 96],
}

from django.db.models import Count, Q, FloatField
from django.db.models.functions import Cast
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK


class FilterRestaurantsByCategoryAPIView(APIView):
    def post(self, request):
        filters = request.data
        categories = filters.get("categories", [])  # 카테고리 번호 리스트 (1~8)
        sort_by = filters.get("sort")  # 정렬 기준
        has_review_event = filters.get("has_review_event")  # 리뷰 이벤트 여부

        # 기본값 설정
        if not categories:
            # 모든 카테고리를 포함
            type_ids = [type_id for types in CATEGORY_MAP.values() for type_id in types]
        else:
            invalid_categories = [category for category in categories if category not in CATEGORY_MAP]
            if invalid_categories:
                return Response(
                    {"error": f"Invalid categories: {invalid_categories}. Valid categories are 1 to 8."},
                    status=HTTP_400_BAD_REQUEST,
                )
            # 선택한 모든 카테고리의 type_id 목록 가져오기
            type_ids = [type_id for category in categories for type_id in CATEGORY_MAP[category]]

        # 기본 쿼리셋
        queryset = Restaurant.objects.filter(type_id__in=type_ids)

        # 리뷰 이벤트 여부 필터링 (is_active 기반)
        if has_review_event is not None:
            queryset = queryset.filter(is_active=has_review_event)

        # 긍정 비율 계산: 긍정 리뷰(ai_sentiment=0) / 전체 리뷰 수
        queryset = queryset.annotate(
            total_reviews=Count("review"),
            positive_reviews=Count("review", filter=Q(review__ai_sentiment=0)),
            positive_ratio=Cast(
                Count("review", filter=Q(review__ai_sentiment=0)), FloatField()
            )
            / Cast(Count("review"), FloatField())
        )

        # 정렬 기준 설정
        sort_options = {
            "ai_score": "-ai_review_score",  # AI 점수 순 (내림차순)
            "positive_ratio": "-positive_ratio",  # 긍정 비율 순 (내림차순)
        }

        # 기본 정렬 기준 설정
        if sort_by is None:
            sort_field = "id"  # 기본적으로 ID로 정렬 (오름차순)
        elif sort_by not in sort_options:
            return Response(
                {"error": "Invalid sort option. Choose one of: ai_score, positive_ratio."},
                status=HTTP_400_BAD_REQUEST,
            )
        else:
            sort_field = sort_options[sort_by]

        queryset = queryset.order_by(sort_field)

        # 결과 제한
        queryset = queryset[:20]  # 최대 20개

        # 결과 변환
        results = [
            {
                "id": restaurant.id,
                "name": restaurant.name,
                "ai_score": restaurant.ai_review_score,
                "has_review_event": restaurant.is_active,  # 리뷰 이벤트 여부
                "main_image_url": restaurant.main_image_url,
                "address": restaurant.road_address or restaurant.common_address,
                "positive_ratio": round(restaurant.positive_ratio, 2) if restaurant.positive_ratio is not None else 0.0,  # 긍정 비율
            }
            for restaurant in queryset
        ]

        return Response({"results": results}, status=HTTP_200_OK)

#detail page
from django.db.models import Count, Q, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from django.shortcuts import get_object_or_404
from reviews.models import Restaurant, Review, RestaurantPlatformInfo, RestaurantPlatformAnalysis
from django.db.models import Count, Avg
class RestaurantDetailAPIView(APIView):
    def get(self, request, restaurant_id):
        # 디버깅: 전달된 restaurant_id 확인
        print(f"Received restaurant_id: {restaurant_id}")

        # 튜플 형태로 잘못 전달된 경우 처리
        if isinstance(restaurant_id, tuple):
            restaurant_id = restaurant_id[0]
            print(f"DEBUG: Extracted restaurant_id from tuple: {restaurant_id}")

        # 식당 정보 가져오기
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        print(f"DEBUG: Retrieved restaurant directly from database: {restaurant}")

        # 리뷰 요약 통계 계산
        reviews = Review.objects.filter(
            restaurant=restaurant,
            author__isnull=False,
            author__platform__isnull=False
        )
        total_reviews = reviews.count()

        if total_reviews > 0:
            positive_reviews = reviews.filter(ai_sentiment__code=0).count()
            negative_reviews = reviews.filter(ai_sentiment__code=1).count()
            positive_ratio = round(positive_reviews / total_reviews, 2)
            negative_ratio = round(negative_reviews / total_reviews, 2)
            fake_ratio = round(
                reviews.filter(ai_is_true_review=False).count() / total_reviews, 2
            )
        else:
            positive_ratio = 0.0
            negative_ratio = 0.0
            fake_ratio = 0.0

        # 플랫폼 설명 가져오기
        platform_description = RestaurantPlatformInfo.objects.filter(
            restaurant=restaurant
        ).values_list("description", flat=True).first()
        print(f"DEBUG: Retrieved platform description: {platform_description}")

        # 리뷰 요약 가져오기
        platform_summary = RestaurantPlatformSummary.objects.filter(
            restaurant=restaurant
        ).first()
        if platform_summary:
            positive_summary = platform_summary.positive_summary or "No positive summary available."
            negative_summary = platform_summary.negative_summary or "No negative summary available."
            print(f"DEBUG: Retrieved positive summary: {positive_summary}")
            print(f"DEBUG: Retrieved negative summary: {negative_summary}")
        else:
            positive_summary = "No positive summary available."
            negative_summary = "No negative summary available."
            print("DEBUG: No platform summary available.")



        # 플랫폼 ID와 이름 매핑
        platform_id_name_mapping = {
            1: '네이버 지도',
            2: '카카오맵',
            3: '배달의 민족',
            4: '쿠팡이츠',
        }

        # 플랫폼별 리뷰 수와 평균 점수 계산
        platform_reviews = reviews.values('author__platform_id').annotate(
            count=Count('id'),
            avg_score=Avg('score')
        )

        reviews_data = []

        for entry in platform_reviews:
            platform_id = entry['author__platform_id']
            platform_name = platform_id_name_mapping.get(platform_id, '알 수 없는 플랫폼')
            count = entry['count']
            avg_score = round(entry['avg_score'], 2) if entry['avg_score'] else 0

            reviews_data.append({
                'platform': platform_name,
                'count': count,
                'avg_score': avg_score
            })


        # 응답 데이터 구성
        data = {
            "restaurant": {
                "id": restaurant.id,
                "name": restaurant.name,
                "ai_review_score": restaurant.ai_review_score,
                "prediction_accuracy": restaurant.prediction_accuracy,
                "average_rating": restaurant.average_rating,
                "has_review_event": restaurant.is_active,
                "road_address": restaurant.road_address,
                "common_address": restaurant.common_address,
                "jibun_address": restaurant.jibun_address,
                "latitude": restaurant.latitude,
                "longitude": restaurant.longitude,
                "main_image_url": restaurant.main_image_url,
                "type": restaurant.type.type_name if restaurant.type else None,
            },
            "ai_review": {
                "opinion": "GOOD" if positive_ratio > 0.6 else "NOT BAD",
                "overview": {
                    "description": platform_description or "No description available.",
                },
                "review_summary": {
                    "positive_summary": positive_summary,
                    "negative_summary": negative_summary
                },
                "review_sentiment_ratio": {
                    "positive": positive_ratio,
                    "negative": negative_ratio,
                },
                "review_fake_ratio": fake_ratio,
            },
            'reviews': reviews_data
        }

        return Response(data, status=HTTP_200_OK)
