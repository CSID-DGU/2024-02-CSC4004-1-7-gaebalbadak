import json
import os
import random
import time
import traceback
import uuid
from datetime import datetime
from inspect import trace
from urllib.parse import urlencode

import django
import requests

import ssh_manager
from utils.string_utils import calculate_similarity, parse_date_string_coupang_eats

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Platform, RestaurantPlatformInfo, Restaurant, ReviewAuthor, Review


def get_shop_identifier_id(target_shop_name, latitude, longitude):
    target_shop_name = target_shop_name.replace('역점', '')

    base_url = 'https://api.coupangeats.com/endpoint/store.get_search'
    query_params = {
        'keyWord': target_shop_name,
        'latitude': latitude,
        'longitude': longitude,
        'sort': 'nearby'
    }

    headers = {
        "X-EATS-LOCALE": "ko",
        "X-EATS-LOCATION": f'{{"latitude": {latitude}, "longitude": {longitude}}}',
        "X-EATS-OS-TYPE": "iOS",
        "Accept": "*/*",
        "Accept-Language": "ko-KR;q=1.0, en-KR;q=0.9",
        "Host": "api.coupangeats.com",
        "X-EATS-TIME-ZONE": "Asia/Seoul",
        "X-EATS-DEVICE-ID": "4F30DECC-2E9B-4F24-884B-2DE8E85C086D/com.coupang.coupang-eats",
        "X-EATS-PCID": "4F30DECC-2E9B-4F24-884B-2DE8E85C086D",
        "X-EATS-APP-VERSION": "1.4.86",
        "X-EATS-NETWORK-TYPE": "WiFi",
        "Connection": "keep-alive",
        "User-Agent": "Eats-AppStore/1.4.86 (com.coupang.coupang-eats; build:11956; iOS 18.0.1) Alamofire/5.9.1",
        "Authorization": "Bearer eyJraWQiOiJjMjM3NDM1OC1lYzZlLTRkNjgtOTFlNS0zMjVkM2I4YjVkMmMiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJleHQiOnsiUENJRCI6ImVmNmM5YmI5MTY4NDczNGQxMDc0ZTYxM2FlMGRhZDcxIiwiYXV0aEJ5Ijoic2Vzc2lvbktleSIsImZpYXQiOjEuNzExNjE2MTQ0RTksInYiOiIxIiwiTFNJRCI6IjA5ZWRkYWRhLWUyOTUtNGE0Ny05M2ZkLTFlZTdmNGYwYTE1ZCIsIkZBR0UiOiI1OSJ9LCJzdWIiOiIxNDAxMTYyNzciLCJhdWQiOlsiaHR0cHM6Ly93d3cuY291cGFuZ2VhdHMuY29tIiwiaHR0cHM6Ly93d3cuY291cGFuZy5jb20iXSwic2NwIjpbIm9mZmxpbmUiLCJvcGVuaWQiLCJlYXRzIiwiY29yZS1zaGFyZWQiLCJwYXkiXSwibmJmIjoxNzMxOTM4MDI3LCJpc3MiOiJodHRwczovL21hdXRoLmNvdXBhbmcuY29tLyIsImV4cCI6MTczMTk1MjQyNywiaWF0IjoxNzMxOTM4MDI3LCJqdGkiOiIyYmVhYTc3NS0xNmQ1LTQzY2ItOGQwZS05ZTZlMDU5OWUwMTgiLCJjbGllbnRfaWQiOiJlNGNkOGZhYi0zM2ViLTRmNjQtODJjNC05MDQwMGNkNmNmZjgifQ.F4JAJYtvAooAwuN6KtPjgg_lZO5G6C4b3S6CI5yuLGrQINltmrN0KCrTnXmd0Tmu3-ASJYNE_q5WBP1-UhvOVQ",
    }

    url = f"{base_url}?{urlencode(query_params)}"
    response = requests.get(url, headers=headers)
    data = response.json()

    if ('text' in data['data']['entityList'][0]['entity']['data'] and
        data['data']['entityList'][0]['entity']['data']['text'][0]['text'] == "검색 결과가 없습니다."):
        return None

    try:
        shop_name = data['data']['entityList'][1]['entity']['data']['name']
    except KeyError:
        time.sleep(1.8)
        return get_shop_identifier_id(' '.join(target_shop_name.split(' ')[:-1]), latitude, longitude)

    if calculate_similarity(target_shop_name, shop_name) > 0.7:
        return data['data']['entityList'][1]['entity']['data']['id']
    else:
        return None

def fetch_and_store_restaurant_info():
    restaurants = Restaurant.objects.all()
    existed_shop_info = RestaurantPlatformInfo.objects.filter(platform=Platform.objects.get(name='coupang_eats'))
    restaurants = [restaurant for restaurant in restaurants if not existed_shop_info.filter(restaurant=restaurant).exists()]

    max_reviews = len(restaurants)
    print(f'쿠팡이츠 정보가 등록되지 않은 {max_reviews}개의 음식점을 찾았습니다.\n')
    for index, restaurant in enumerate(restaurants):
        shop_name = restaurant.name
        latitude = restaurant.latitude
        longitude = restaurant.longitude

        identifier_id = get_shop_identifier_id(shop_name, latitude, longitude)

        if identifier_id is None:
            identifier_id = '-1'
            print(f'{index+1}. {shop_name}(은)는 쿠팡이츠에 등록되지 않은 음식점입니다.')

        restaurant_platform_info = RestaurantPlatformInfo(
            restaurant=restaurant,
            platform=Platform.objects.get(name='coupang_eats'),
            description=None,
            identifier=identifier_id
        )
        restaurant_platform_info.save()

        if identifier_id != '-1':
            print(f'{index+1}. {shop_name}의 identifier_id: {identifier_id}(을)를 저장했습니다. (진행률: {(index+1) / max_reviews * 100:.2f}%)')

        random_sleep = random.uniform(1.4, 3)
        time.sleep(random_sleep)

def get_restaurant_reviews_data(identifier_id, latitude, longitude, next_token=None):
    base_url = "https://api.coupangeats.com/endpoint/store.get_reviews_v2"
    query_params = {
        'sort': 'LATEST_DESC',
        'storeId': identifier_id
    }

    if next_token is not None:
        query_params['nextToken'] = next_token

    url = f"{base_url}?{urlencode(query_params)}"
    headers = {
        "X-EATS-LOCALE": "ko",
        "X-EATS-LOCATION": f'{{"latitude": {latitude}, "longitude": {longitude}}}',
        "X-EATS-OS-TYPE": "iOS",
        "Accept": "*/*",
        "Accept-Language": "ko-KR;q=1.0, en-KR;q=0.9",
        "Host": "api.coupangeats.com",
        "X-EATS-TIME-ZONE": "Asia/Seoul",
        "X-EATS-DEVICE-ID": "4F30DECC-2E9B-4F24-884B-2DE8E85C086D/com.coupang.coupang-eats",
        "X-EATS-PCID": "4F30DECC-2E9B-4F24-884B-2DE8E85C086D",
        "X-EATS-APP-VERSION": "1.4.86",
        "X-EATS-NETWORK-TYPE": "WiFi",
        "Connection": "keep-alive",
        "User-Agent": "Eats-AppStore/1.4.86 (com.coupang.coupang-eats; build:11956; iOS 18.0.1) Alamofire/5.9.1",
        "Authorization": "Bearer eyJraWQiOiJjMjM3NDM1OC1lYzZlLTRkNjgtOTFlNS0zMjVkM2I4YjVkMmMiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJleHQiOnsiUENJRCI6ImVmNmM5YmI5MTY4NDczNGQxMDc0ZTYxM2FlMGRhZDcxIiwiYXV0aEJ5Ijoic2Vzc2lvbktleSIsImZpYXQiOjEuNzExNjE2MTQ0RTksInYiOiIxIiwiTFNJRCI6IjA5ZWRkYWRhLWUyOTUtNGE0Ny05M2ZkLTFlZTdmNGYwYTE1ZCIsIkZBR0UiOiI1OSJ9LCJzdWIiOiIxNDAxMTYyNzciLCJhdWQiOlsiaHR0cHM6Ly93d3cuY291cGFuZ2VhdHMuY29tIiwiaHR0cHM6Ly93d3cuY291cGFuZy5jb20iXSwic2NwIjpbIm9mZmxpbmUiLCJvcGVuaWQiLCJlYXRzIiwiY29yZS1zaGFyZWQiLCJwYXkiXSwibmJmIjoxNzMxOTM4MDI3LCJpc3MiOiJodHRwczovL21hdXRoLmNvdXBhbmcuY29tLyIsImV4cCI6MTczMTk1MjQyNywiaWF0IjoxNzMxOTM4MDI3LCJqdGkiOiIyYmVhYTc3NS0xNmQ1LTQzY2ItOGQwZS05ZTZlMDU5OWUwMTgiLCJjbGllbnRfaWQiOiJlNGNkOGZhYi0zM2ViLTRmNjQtODJjNC05MDQwMGNkNmNmZjgifQ.F4JAJYtvAooAwuN6KtPjgg_lZO5G6C4b3S6CI5yuLGrQINltmrN0KCrTnXmd0Tmu3-ASJYNE_q5WBP1-UhvOVQ",
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    if next_token is None:
        review_data = data['data']['entityList'][2:]
    else:
        review_data = data['data']['entityList']

    next_token = data['data']['nextToken']
    review_data = [data['entity']['data'] for data in review_data ]

    return review_data, next_token

def generate_unique_author_id():
    return str(uuid.uuid4())  # 고유한 UUID 생성


def to_string(menu_items):
    output = ''
    for item in menu_items:
        output += item['text'][0]['text'] + ';'
    if output.endswith(';'):
        output = output[:-1]
    return output

def fetch_and_store_restaurant_reviews():
    max_reviews = 500
    restaurant_platform_infos = RestaurantPlatformInfo.objects.filter(platform=Platform.objects.get(name='coupang_eats'))
    restaurant_platform_infos = [restaurant_platform_info for restaurant_platform_info in restaurant_platform_infos
                                 if restaurant_platform_info.identifier != '-1'
                                 and restaurant_platform_info.last_updated is None]

    max_len = len(restaurant_platform_infos)
    platform = Platform.objects.get(name='coupang_eats')
    print(f'리뷰가 기록되지 않은 {max_len}개의 음식점을 찾았습니다.\n')

    for index, restaurant_platform_info in enumerate(restaurant_platform_infos):
        saved_reviews = 0

        restaurant = restaurant_platform_info.restaurant
        restaurant_name = restaurant.name
        identifier_id = restaurant_platform_info.identifier
        latitude = restaurant_platform_info.restaurant.latitude
        longitude = restaurant_platform_info.restaurant.longitude

        next_token = None
        while True:
            reviews_data, next_token = get_restaurant_reviews_data(identifier_id, latitude, longitude, next_token)

            for item in reviews_data:
                if saved_reviews >= max_reviews:
                    break

                if item['suspension'] is not None:
                    print(f'{restaurant_name}: 임시조치에 따라 게시가 중단된 리뷰입니다.')
                    continue

                if item['isOwner']:
                    continue

                nickname = item['writer']
                author_avg_score = float(item['writerReviewRatingText'][5]['text'])
                author_review_count = int(item['writerReviewRatingText'][1]['text'])

                # 쿠팡이츠는 사용자 개인 프로필을 열람할 수 없음
                author, _ = ReviewAuthor.objects.get_or_create(
                    platform=platform,
                    nickname=nickname,
                    defaults={
                        'average_rating': author_avg_score,
                        'review_count': author_review_count,
                        'author_platform_id': generate_unique_author_id()  # 고유 ID 생성 함수 사용 예시
                    }
                )

                content = item['reviewText']

                # 리뷰가 비어있는 경우 카운트하지 않음
                if content is None or content == '':
                    print(f'{restaurant_name}: 리뷰가 비어있어 저장하지 않았습니다.')
                    continue

                score = item['reviewRating']
                selected_menu = to_string(item['orderedMenuItems'])
                created_at = parse_date_string_coupang_eats(item['writtenDay'])
                has_reply = 'merchantReply' in item
                has_image = len(item['imagePaths']) != 0
                likes_count = None
                manual_label_attempted = False

                review = Review(
                    restaurant=restaurant,
                    author=author,
                    content=content,
                    selected_menu=selected_menu,
                    score=score,
                    created_at=created_at,
                    has_reply=has_reply,
                    has_image=has_image,
                    likes_count=likes_count,
                    manual_label_attempted=manual_label_attempted
                )

                existing_review = Review.objects.filter(
                    restaurant=restaurant,
                    author=author,
                    score=score,
                    content=content,
                    created_at=created_at,
                ).exists()

                if existing_review:
                    print(f'{restaurant_name}: 저장을 시도하는 리뷰가 이미 존재합니다. {content}')
                    continue
                else:
                    saved_reviews += 1
                    review.save()
                    print(f'{restaurant_name}: {saved_reviews}/{max_reviews}개의 리뷰를 저장했습니다. ({saved_reviews / max_reviews * 100:.2f}%)')

            if saved_reviews >= max_reviews:
                break

            if len(reviews_data) < 20 or next_token is None:
                break
            random_sleep = random.uniform(2.4, 3)
            time.sleep(random_sleep)

        restaurant_platform_info.last_updated = datetime.now()
        restaurant_platform_info.save()
        print(f'{index+1}. {restaurant_platform_info.restaurant.name}: 리뷰 수집 완료. (진행률: {(index+1) / max_len * 100:.2f}%)')

        random_sleep = random.uniform(2.4, 3)
        time.sleep(random_sleep)

def process():
    try:
        # fetch_and_store_restaurant_notice()
        fetch_and_store_restaurant_reviews()
        # fetch_and_store_restaurant_description()
        # fetch_and_store_restaurant_info()
    except KeyboardInterrupt as e:
        print("사용자에 의해 프로세스가 중단되었습니다.")
    except Exception as e:
        print(f"문제가 발생했습니다. {e}")
        traceback.print_exc()


if __name__ == '__main__':
    process()