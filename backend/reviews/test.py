import os
from urllib.parse import urlencode

import django
import requests

import ssh_manager
from utils.string_utils import calculate_similarity

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from reviews.models import Review, Restaurant, RestaurantPlatformInfo, Platform

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
        return get_shop_identifier_id(' '.join(target_shop_name.split(' ')[:-1]), latitude, longitude)

    if calculate_similarity(target_shop_name, shop_name) > 0.7:
        return data['data']['entityList'][1]['entity']['data']['id']
    else:
        return None

# test

print(get_shop_identifier_id('필동커피', 37.560078, 126.992633))