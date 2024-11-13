from openai import OpenAI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#test

client = OpenAI(
    api_key='api key 넣으셔요',
)

def preprocess_text(text):
    """리뷰 텍스트가 10자 이상일 경우만 반환합니다."""
    return text if len(text) >= 10 else None


def summarize_review_text(review_text):
    """리뷰 텍스트를 요약하는 함수"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": f"{review_text}를 요약해주세요."}],
        max_tokens=100
    )
    return response.choices[0].message.content.strip()


class ReviewSummaryAPIView(APIView):
    def get(self, request):
        # 모든 리뷰를 조회하고 요약하여 저장
        reviews = Review.objects.all()
        summaries = []

        for review in reviews:
            preprocessed_text = preprocess_text(review.content)

            # 10자 미만의 리뷰는 제외
            if not preprocessed_text:
                continue

            try:
                # 리뷰 요약
                summary_text = summarize_review_text(preprocessed_text)

                # RestaurantPlatformSummary 테이블에 요약 저장
                summary, created = RestaurantPlatformSummary.objects.update_or_create(
                    restaurant_id=review.restaurant_id,
                    platform_id=review.platform_id,
                    defaults={
                        'positive_summary': summary_text  # 긍정 요약 내용 예시로 저장
                    }
                )

                summaries.append({
                    "review_id": review.id,
                    "original_text": review.content,
                    "summary": summary_text
                })

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 요약된 리뷰 목록을 JSON으로 반환
        return Response({"summaries": summaries}, status=status.HTTP_200_OK)
