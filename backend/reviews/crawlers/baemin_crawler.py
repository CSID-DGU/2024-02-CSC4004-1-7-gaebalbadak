import os
import random
import re
import traceback
from html import unescape

import django
import ssh_manager

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()


import requests
import time
from urllib.parse import urlencode
from datetime import datetime, timedelta

from reviews.models import Restaurant, RestaurantPlatformInfo, Platform, Review, ReviewAuthor
from utils.string_utils import *


def get_shop_identifier_id(target_shop_name, latitude, longitude):
    target_shop_name = target_shop_name.replace('역점', '')

    base_url = 'https://search-gateway.baemin.com/v1/search'
    query_params = {
        "actionTrackingKey": "Organic",
        "adid": "5367EF5F-8A38-493A-A2FA-7F9574E6BBDC",
        "appver": "14.7.4",
        "baeminDeliveryFilter": "",
        "baeminDeliverySort": "SORT__DEFAULT",
        "baeminTakeoutFilter": "",
        "baeminTakeoutSort": "",
        "carrier": "6553565535",
        "currentTab": "BAEMIN_DELIVERY",
        "deviceModel": "iPhone13%2C2",
        "extension": "",
        "hyperMarketSearchType": "DEFAULT",
        "hyperMarketSort": "BASIC_A",
        "isBaeminStoreRegion": "1",
        "isBmartRegion": "1",
        "isFirstRequest": "1",
        "keyword": target_shop_name,
        "kind": "DEFAULT",
        "latitude": latitude,
        "longitude": longitude,
        "limit": "25",
        "offset": "0",
        "oscd": "1",
        "osver": "18.0.1",
    }

    headers = {
        "Carrier": "6553565535",
        "Connection": "keep-alive",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "USER-BAEDAL": "kxC6suBtLCIyoxIhKLgx5bTlew+Bm3y/Laat568rHUdOwDDrEAZlI8Eeuylb35mw6P315PMkmXwCu+zth4gOW9O6ShQBkMFoWgJz5G/qFo4GECmEtxIlr97rbMxxPKCiLzDh8mFKVRsvjwmf6pEH+tOY6G0CS2oJ6cAOrK7/296ixbI+dR2iKx5VJm9523GjB+BEmwS8vmX1AgI7YccsohMvIxHzxRa2Zl4RloY2uQ8=",
        "User-Agent": "iph1_14.7.4",
        "Host": "search-gateway.baemin.com",
        "Authorization": f"Bearer {get_oauth_token()}",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br"
    }

    url = f"{base_url}?{urlencode(query_params)}"
    response = requests.get(url, headers=headers)
    data = response.json()

    if len(data['data']['list'][0]['result']['shops']) == 0:
        return None

    shop_name = data['data']['list'][0]['result']['shops'][0]['shopInfo']['shopName']

    if calculate_similarity(target_shop_name, shop_name) > 0.7:
        return data['data']['list'][0]['result']['shops'][0]['shopInfo']['shopNumber']
    else:
        return None

def get_oauth_token():
    url = 'https://auth.baemin.com/oauth/token'
    payload = {
        "actionTrackingKey": "Organic",
        "adid": "5367EF5F-8A38-493A-A2FA-7F9574E6BBDC",
        "appver": "14.6.0",
        "carrier": "6553565535",
        "deviceModel": "iPhone13,2",
        "dongCode": "11140142",
        "dvc_uniq_id": "36B33386-0804-45CC-9D31-D42B7AA65566",
        "dvcid": "OPUD1B0A4581-FED0-466C-9888-F8AEFCF6B770",
        "grant_type": "refresh_token",
        "oscd": "1",
        "osver": "18.0.1",
        "refresh_token": "f480631e-aed5-4e54-adc5-e73696dd4238",
        "scope": "read",
        "sessionid": "812520f3ff25318ad2c9c99a90af90c9",
        "site": "7jWXRELC2e",
        "zipCode": "04626"
    }

    response = requests.post(url, data=payload)
    return response.json()['access_token']

def get_shop_description(identifier_id):
    base_url = f'https://shopdp-api.baemin.com/shop/{identifier_id}/info-detail'

    query_params = {
        "actionTrackingKey": "Organic",
        "adid": "5367EF5F-8A38-493A-A2FA-7F9574E6BBDC",
        "appver": "14.7.4",
        "carrier": "6553565535",
        "deviceModel": "iPhone13%2C2",
        "dongCode": "11140142",
        "dvc_uniq_id": "36B33386-0804-45CC-9D31-D42B7AA65566",
        "dvcid": "OPUD1B0A4581-FED0-466C-9888-F8AEFCF6B770",
        "lat": "37.55599482402222",
        "lng": "126.9944666787064",
        "oscd": "1",
        "osver": "18.0.1",
    }

    headers = {
        "Connection": "keep-alive",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "USER-BAEDAL": "kxC6suBtLClyoxIhKLgx5bTlew+Bm3y/Laat568rHUdOwDDrEAZIl8EeuyIb35mw6P315PMkmXwCu+zth4gOW9O6ShQBkMFoWgJz5G/qFo4GECmEtxIlr97rbMxxPKCiLzDh8mFKVRsvjwmf6pEH+tOY6G0CS2oJ6cAOrK7/296ixbl+dR2iKx5VJm9523GjB+BEmwS8vmX1Agl7YccsohMvlxHzxRa2Zl4RIoY2uQ8=",
        "User-Agent": "iph1_14.7.4",
        "Host": "shopdp-api.baemin.com",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br"
    }

    # Construct the URL
    url = f"{base_url}?{urlencode(query_params)}"

    response = requests.get(url, headers=headers)
    return response.json()['data']['introductionInfo']['shopIntroMessage']

def get_restaurant_reviews_data(identifier_id, offset=0, get_past_reviews=False):
    base_url = f'https://review-api.baemin.com/v1/shops/{identifier_id}/reviews'
    if get_past_reviews:
        base_url += '/past'
    query_params = {
        "filter": "ALL",
        "limit": "30",
        "offset": offset,
        "site": "7jWXRELC2e",
        "sort": "MOST_RECENT"
    }
    url = f"{base_url}?{urlencode(query_params)}"
    access_token = get_oauth_token()
    headers = {
        "User-Agent": "iph1_14.6.0",
        "Host": "review-api.baemin.com",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "*/*",
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data['data']['reviews']

def fetch_and_store_restaurant_info():
    restaurants = Restaurant.objects.all()
    existed_shop_info = RestaurantPlatformInfo.objects.filter(platform=Platform.objects.get(name='baemin'))
    restaurants = [restaurant for restaurant in restaurants if not existed_shop_info.filter(restaurant=restaurant).exists()]

    max_reviews = len(restaurants)
    print(f'배달의 민족 정보가 등록되지 않은 {max_reviews}개의 음식점을 찾았습니다.\n')
    for index, restaurant in enumerate(restaurants):
        shop_name = restaurant.name
        latitude = restaurant.latitude
        longitude = restaurant.longitude

        identifier_id = get_shop_identifier_id(shop_name, latitude, longitude)

        if identifier_id is None:
            identifier_id = '-1'
            print(f'{index+1}. {shop_name}(은)는 배달의 민족에 등록되지 않은 음식점입니다.')

        restaurant_platform_info = RestaurantPlatformInfo(
            restaurant=restaurant,
            platform=Platform.objects.get(name='baemin'),
            description=None,
            identifier=identifier_id
        )
        restaurant_platform_info.save()
        if identifier_id != '-1':
            print(f'{index+1}. {shop_name}의 identifier_id: {identifier_id}(을)를 저장했습니다. (진행률: {(index+1) / max_reviews * 100:.2f}%)')

        random_sleep = random.uniform(1.2, 3)
        time.sleep(random_sleep)

def fetch_and_store_restaurant_description():
    restaurant_platform_infos = RestaurantPlatformInfo.objects.filter(platform=Platform.objects.get(name='baemin'))
    restaurant_platform_infos = [restaurant_platform_info for restaurant_platform_info in restaurant_platform_infos
                                 if restaurant_platform_info.description is None
                                 and restaurant_platform_info.identifier != '-1']

    max_len = len(restaurant_platform_infos)
    print(f'음식점 설명이 등록되지 않은 {max_len}개의 음식점을 찾았습니다.\n')

    for index, restaurant_platform_info in enumerate(restaurant_platform_infos):
        identifier_id = restaurant_platform_info.identifier
        description = get_shop_description(identifier_id)
        if description is None or description == '':
            description = '-'
        restaurant_platform_info.description = description
        restaurant_platform_info.save()

        print(f'{index+1}. {restaurant_platform_info.restaurant.name}: 업데이트 완료. (진행률: {(index+1) / max_len * 100:.2f}%)')

        random_sleep = random.uniform(1.2, 3)
        time.sleep(random_sleep)

def get_restaurant_notice(identifier_id):
    base_url = f'https://shopdp-api.baemin.com/v8/shop/{identifier_id}/detail'

    query_params = {
        "actionTrackingKey": "Organic",
        "appver": "14.7.4",
        "campaignId": "-1",
        "carrier": "6553565535",
        "defaultreview": "N",
        "deviceModel": "iPhone13%2C2",
        "displayGroup": "SEARCH_DELIVERY",
        "dvcid": "OPUD1B0A4581-FED0-466C-9888-F8AEFCF6B770",
        "filter": "",
        "lat": "37.55599482402222",
        "lng": "126.9944666787064",
        "mem": "180208002784",
        "oscd": "1",
    }

    url = f"{base_url}?{urlencode(query_params)}"

    headers = {
        "User-Agent": "iph1_14.7.4",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Host": "shopdp-api.baemin.com",
        "USER-BAEDAL": "kxC6suBtLCIyoxIhKLgx5bTlew+Bm3y/Laat568rHUdOwDDrEAZlI8Eeuylb35mw6P315PMkmXwCu+zth4gOW9O6ShQBkMFoWgJz5G/qFo4GECmEtxIlr97rbMxxPKCiLzDh8mFKVRsvjwmf6pEH+tOY6G0CS2oJ6cAOrK7/296ixbI+dR2iKx5VJm9523GjB+BEmwS8vmX1AgI7YccsohMvIxHzxRa2Zl4RloY2uQ8=",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    try:
        notice_message = data['data']['shopInfo']['attentionMessage']
    except KeyError:
        notice_message = ''
        print(f'일반 공지사항을 찾을 수 없습니다. {identifier_id}')

    try:
        if notice_message is None or notice_message == '':
            notice_message = data['data']['shop_menu']['menu_info']['Att_Cont']
    except KeyError:
        print(f'대체 공지사항도 찾지 못했습니다. {identifier_id}')
        notice_message = None

    return notice_message

def fetch_and_store_restaurant_notice():
    restaurant_platform_infos = RestaurantPlatformInfo.objects.filter(platform=Platform.objects.get(name='baemin'))
    restaurant_platform_infos = [restaurant_platform_info for restaurant_platform_info in restaurant_platform_infos
                                 if restaurant_platform_info.platform_id == 3
                                 and restaurant_platform_info.identifier != '-1']

    max_len = len(restaurant_platform_infos)
    print(f'배달의 민족 플랫폼에서 {max_len}개의 음식점을 찾았습니다.\n')

    for index, restaurant_platform_info in enumerate(restaurant_platform_infos):
        identifier_id = restaurant_platform_info.identifier
        notice_message = get_restaurant_notice(identifier_id)

        if notice_message is None or notice_message == '':
            print(f'{index+1}. {restaurant_platform_info.restaurant.name}: 공지사항이 없습니다.')
            continue

        description = restaurant_platform_info.description
        description += f'\n\n[Notice]\n{notice_message}'

        restaurant_platform_info.description = description
        restaurant_platform_info.save()

        print(f'{index+1}. {restaurant_platform_info.restaurant.name}: 업데이트 완료. (진행률: {(index+1) / max_len * 100:.2f}%)')

        random_sleep = random.uniform(1.2, 3)
        time.sleep(random_sleep)


def parse_date_string(date_text):
    date_text = date_text.split(',')[0]
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    if date_text == '오늘':
        result_date = today
    elif date_text == '어제':
        result_date = today - timedelta(days=1)
    elif date_text == '그제':
        result_date = today - timedelta(days=2)
    elif date_text == '이번 주':
        # Monday is 0 and Sunday is 6
        weekday = today.weekday()
        result_date = today - timedelta(days=weekday)
    elif date_text == '지난 주':
        weekday = today.weekday()
        result_date = today - timedelta(days=weekday + 7)
    elif date_text == '이번 달':
        result_date = today.replace(day=1)
    elif date_text == '지난 달':
        first_day_this_month = today.replace(day=1)
        last_month_last_day = first_day_this_month - timedelta(days=1)
        result_date = last_month_last_day.replace(day=1)
    elif date_text == '작년':
        result_date = today.replace(year=today.year - 1, month=1, day=1)
    elif date_text == '재작년':
        result_date = today.replace(year=today.year - 2, month=1, day=1)
    else:
        month_match = re.match(r'(\d+)개월 전', date_text)
        year_match = re.match(r'(\d+)년 전', date_text)
        if month_match:
            N = int(month_match.group(1))
            year = today.year
            month = today.month - N
            while month < 1:
                month += 12
                year -= 1
            result_date = today.replace(year=year, month=month, day=1)
        elif year_match:
            N = int(year_match.group(1))
            result_date = today.replace(year=today.year - N, month=1, day=1)
        else:
            raise ValueError("지원하지 않는 입력입니다.")
    return result_date


def to_string(menus):
    output = ''
    for menu in menus:
        output += menu['name'] + ';'
    if output.endswith(';'):
        output = output[:-1]
    return output

def format_html_text(text):
    text = text.replace('&nbsp;', ' ')
    text = re.sub(r'<br\s*/?>', '\n', text)
    return text

def fetch_and_store_restaurant_reviews():
    max_reviews = 300
    restaurant_platform_infos = RestaurantPlatformInfo.objects.filter(platform=Platform.objects.get(name='baemin'))
    restaurant_platform_infos = [restaurant_platform_info for restaurant_platform_info in restaurant_platform_infos
                                 if restaurant_platform_info.identifier != '-1'
                                 and restaurant_platform_info.last_updated is None]

    max_len = len(restaurant_platform_infos)
    platform = Platform.objects.get(name='baemin')
    print(f'리뷰가 기록되지 않은 {max_len}개의 음식점을 찾았습니다.\n')

    for index, restaurant_platform_info in enumerate(restaurant_platform_infos):
        saved_reviews = 0
        offset = 0
        get_past_reviews = False

        restaurant = restaurant_platform_info.restaurant
        restaurant_name = restaurant.name
        identifier_id = restaurant_platform_info.identifier

        while True:
            reviews_data = get_restaurant_reviews_data(identifier_id, offset, get_past_reviews)

            for item in reviews_data:
                if saved_reviews >= max_reviews:
                    break

                author_id = item['member']['memberNo']
                nickname = item['member']['nickname']
                author_avg_score = item['member']['avgRating']
                author_review_count = item['member']['totalReviewCount']

                author, _ = ReviewAuthor.objects.get_or_create(
                    author_platform_id=author_id,
                    platform=platform,
                    defaults={
                        'nickname': nickname,
                        'average_rating': author_avg_score,
                        'review_count': author_review_count
                    }
                )

                content = format_html_text(item['contents'])

                # 리뷰가 비어있는 경우 카운트하지 않음 (사장님만 볼 수 있는 경우)
                if content is None or content == '':
                    offset += 1
                    print(f'{restaurant_name}: 리뷰가 비어있어 저장하지 않았습니다.')
                    continue

                score = item['rating']
                selected_menu = to_string(item['menus'])
                created_at = get_date_from_string(item['dateText'])
                has_reply = len(item['comments']) != 0
                has_image =len(item['images']) != 0
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
                    content=content,
                    created_at=created_at,
                ).exists()

                if existing_review:
                    print(f'{restaurant_name}: 저장을 시도하는 리뷰가 이미 존재합니다. {author.nickname}, {content}')
                    continue
                else:
                    offset += 1
                    saved_reviews += 1
                    review.save()
                    print(f'{restaurant_name}: {saved_reviews}/{max_reviews}개의 리뷰를 저장했습니다. ({saved_reviews / max_reviews * 100:.2f}%)')

            if saved_reviews >= max_reviews:
                break

            if len(reviews_data) < 30 and not get_past_reviews:
                get_past_reviews = True
                offset = 0
                print(f'{restaurant_name}: 최근 리뷰를 모두 수집했습니다. 과거 리뷰를 수집합니다.')
            elif len(reviews_data) < 30 and get_past_reviews:
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
        fetch_and_store_restaurant_notice()
        # fetch_and_store_restaurant_reviews()
        # fetch_and_store_restaurant_description()
        # fetch_and_store_restaurant_info()
    except KeyboardInterrupt as e:
        print("사용자에 의해 프로세스가 중단되었습니다.")
    except Exception as e:
        print(f"문제가 발생했습니다. {e}")
        traceback.print_exc()


if __name__ == '__main__':
    process()
