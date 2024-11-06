from openai import OpenAI
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

client = OpenAI(
    api_key='api key 넣으셔요',
)


class ReviewSummaryAPIView(APIView):
    def post(self, request):
        review_text = request.data.get("review_text")
        try:
            # 최신 API 형식으로 변경
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": f"{review_text}를 요약해주세요."}
                ],
                max_tokens=100
            )
            summary_text = response.choices[0].message.content.strip()
            return Response({"summary": summary_text}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#review 테이블 접근 시

# #from openai import OpenAI
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Review  # reviews 테이블에 해당하는 Review 모델을 임포트
#
# # OpenAI API 클라이언트 설정
# client = OpenAI(
#     api_key='your_openai_api_key',
# )
#
# class ReviewSummaryAPIView(APIView):
#     def get(self, request):
#         # 데이터베이스에서 모든 리뷰를 조회
#         reviews = Review.objects.all()
#
#         # 각 리뷰 텍스트를 요약하고 결과를 리스트로 저장
#         summaries = []
#         for review in reviews:
#             try:
#                 response = client.chat.completions.create(
#                     model="gpt-3.5-turbo",
#                     messages=[
#                         {"role": "user", "content": f"{review.review_text}를 요약해주세요."}
#                     ],
#                     max_tokens=100
#                 )
#                 summary_text = response.choices[0].message.content.strip()
#                 summaries.append({
#                     "review_id": review.id,
#                     "original_text": review.review_text,
#                     "summary": summary_text,
#                     "sentiment": review.sentiment
#                 })
#
#             except Exception as e:
#                 # 에러 발생 시 해당 에러 메시지를 반환
#                 return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#         # 요약된 리뷰 목록을 JSON으로 반환
#         return Response({"summaries": summaries}, status=status.HTTP_200_OK)
