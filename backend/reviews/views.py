from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from reviews.models import Restaurant


#main page
#자동 완성 기능 API
class AutoCompleteAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')  # 쿼리 파라미터에서 'query' 가져오기
        if not query:
            return Response({"error": "검색어를 입력해주세요."}, status=HTTP_400_BAD_REQUEST)

        # 검색어로 시작하는 이름을 가나다 순으로 정렬
        results = (
            Restaurant.objects.filter(name__startswith=query)
            .order_by("name")  # 이름을 가나다 순으로 정렬
            .values_list("name", flat=True)[:10]  # 최대 10개의 결과
        )

        # 검색 결과를 리스트로 반환
        return Response(list(results), status=HTTP_200_OK)