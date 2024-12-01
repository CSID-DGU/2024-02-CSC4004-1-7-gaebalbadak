import json
import os
import django
import ssh_manager

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.db.models import Q
from pydantic import BaseModel

import personal_key
from reviews.models import Restaurant, RestaurantPlatformInfo, Platform

client = openai.OpenAI(
    api_key=personal_key.OPEN_AI_API_KEY,
)


class IncentivizedResult(BaseModel):
    is_incentivized_restaurant: bool
    based_text: str

def analyze_restaurant(descriptions):
    messages = [{"role": "system", "content": "당신은 음식점의 소개, 영업, 설명 문구를 보고 해당 음식점이 소비자에게 리뷰 작성을 대가로"
                                              "추가적인 서비스를 제공하는지에 대한 여부를 판단하는 AI입니다."
                                              "제공되는 음식점 소개글은 하나의 음식점에 대한 소개글이며, 여러 플랫폼에서 가져온 소개글이 있을 수 있습니다."
                                              "해당 음식점이 대가성 리뷰를 제공한다고 판단되면 is_incentivized_restaurant 값으로 True를, 아니라면 False를 반환해주세요."
                                              "대가성 리뷰라고 판단했다면 그 판단의 근거가 된 문구를 based_text로 반환해주세요."
                                              "대가성 리뷰 예외 예시: A 음식 주문 시 B 음식/반찬/음료수 무료 제공"}]
    messages.append({"role": "user", "content": descriptions})

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=messages,
        response_format=IncentivizedResult
    )
    return response.choices[0].message

def analyze_and_store_restaurant(restaurant):
    naver_info = RestaurantPlatformInfo.objects.filter(Q(platform_id=1) & Q(restaurant_id=restaurant.id)).first()
    baemin_info = RestaurantPlatformInfo.objects.filter(Q(platform_id=3) & Q(restaurant_id=restaurant.id)).first()
    coupang_eats_info = RestaurantPlatformInfo.objects.filter(Q(platform_id=4) & Q(restaurant_id=restaurant.id)).first()

    infos = [naver_info, baemin_info, coupang_eats_info]

    descriptions = ''
    for info in infos:
        if info is not None and info.description is not None:
            descriptions += f'{Platform.objects.filter(id=info.platform_id).first().name} 리뷰: ' + info.description + '\n\n'
    descriptions = descriptions.strip()
    content = analyze_restaurant(descriptions).content
    data = json.loads(content)
    return data['is_incentivized_restaurant'], data['based_text']


def analyze_and_store_restaurants():
    restaurants = Restaurant.objects.all()[500:]

    for restaurant in restaurants:
        result, based = analyze_and_store_restaurant(restaurant)
        print(restaurant.name)
        print(based)
        print(result)
        print('\n')
        restaurant.is_active = result
        restaurant.save()

def test():
    coupang_eats_restaurant = RestaurantPlatformInfo.objects.filter(Q(platform_id=4) & ~Q(identifier='-1'))
    coupang_eats_restaurant_ids = [restaurant.restaurant_id for restaurant in coupang_eats_restaurant]
    baemin_restaurant = RestaurantPlatformInfo.objects.filter(Q(platform_id=3) & ~Q(identifier='-1'))
    baemin_restaurant_ids = [restaurant.restaurant_id for restaurant in baemin_restaurant]

    only_coupang_eats_restaurant = [restaurant for restaurant in coupang_eats_restaurant if restaurant.restaurant_id not in baemin_restaurant_ids]
    only_baemin_restaurant = [restaurant for restaurant in baemin_restaurant if restaurant.restaurant_id not in coupang_eats_restaurant_ids]

    # print(len(only_coupang_eats_restaurant))
    # for restaurant in only_coupang_eats_restaurant:
    #     print(restaurant.restaurant.name)

    print(len(only_baemin_restaurant))
    for restaurant in only_baemin_restaurant:
        print(restaurant.restaurant.name)



if __name__ == '__main__':
    analyze_and_store_restaurants()
    # test()