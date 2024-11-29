import json
import os
import re
import time
import random
import traceback
from datetime import datetime

import django
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()


import requests
from reviews.models import Platform, RestaurantPlatformInfo, RestaurantType, Restaurant, ReviewAuthor, Review


class NaverMapCrawler:
    def __init__(self, corner1_x, corner1_y, corner2_x, corner2_y, level=0):
        self.url = 'https://pcmap-api.place.naver.com/graphql'
        self.payload = {
            "operationName": "getRestaurants",
            "variables": {
                "useReverseGeocode": True,
                "isNmap": True,
                "restaurantListInput": {
                    "query": "음식점",
                    "start": 0,
                    "display": 1,
                    # "x": "128.787973", # 현재 위치
                    # "y": "35.912416",
                    "deviceType": "pcmap",
                    "bounds": f"{corner1_x};{corner1_y};{corner2_x};{corner2_y}",
                    "isPcmap": True
                }
            },
            "query": "query getRestaurants($restaurantListInput: RestaurantListInput, $restaurantListFilterInput: RestaurantListFilterInput, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false, $isNmap: Boolean = false) {\n  restaurants: restaurantList(input: $restaurantListInput) {\n    items {\n      apolloCacheId\n      coupon {\n        ...CouponItems\n        __typename\n      }\n      ...CommonBusinessItems\n      ...RestaurantBusinessItems\n      __typename\n    }\n    ...RestaurantCommonFields\n    optionsForMap {\n      ...OptionsForMap\n      __typename\n    }\n    nlu {\n      ...NluFields\n      __typename\n    }\n    searchGuide {\n      ...SearchGuide\n      __typename\n    }\n    __typename\n  }\n  filters: restaurantListFilter(input: $restaurantListFilterInput) {\n    ...RestaurantFilter\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment NluFields on Nlu {\n  queryType\n  user {\n    gender\n    __typename\n  }\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    nluQuery\n    businessType\n    cid\n    branch\n    forYou\n    franchise\n    titleKeyword\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    repRegion\n    repSpot\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    category\n    menu\n    context\n    __typename\n  }\n  __typename\n}\n\nfragment SearchGuide on SearchGuide {\n  queryResults {\n    regions {\n      displayTitle\n      query\n      region {\n        rcode\n        __typename\n      }\n      __typename\n    }\n    isBusinessName\n    __typename\n  }\n  queryIndex\n  types\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n\nfragment CouponItems on Coupon {\n  total\n  promotions {\n    promotionSeq\n    couponSeq\n    conditionType\n    image {\n      url\n      __typename\n    }\n    title\n    description\n    type\n    couponUseType\n    __typename\n  }\n  __typename\n}\n\nfragment CommonBusinessItems on BusinessSummary {\n  id\n  dbType\n  name\n  businessCategory\n  category\n  description\n  hasBooking\n  hasNPay\n  x\n  y\n  distance\n  imageUrl\n  imageCount\n  phone\n  virtualPhone\n  routeUrl\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  roadAddress\n  address\n  commonAddress\n  blogCafeReviewCount\n  bookingReviewCount\n  totalReviewCount\n  bookingUrl\n  bookingBusinessId\n  talktalkUrl\n  detailCid {\n    c0\n    c1\n    c2\n    c3\n    __typename\n  }\n  options\n  promotionTitle\n  agencyId\n  businessHours\n  newOpening\n  markerId @include(if: $isNmap)\n  markerLabel @include(if: $isNmap) {\n    text\n    style\n    __typename\n  }\n  imageMarker @include(if: $isNmap) {\n    marker\n    markerSelected\n    __typename\n  }\n  __typename\n}\n\nfragment RestaurantFilter on RestaurantListFilterResult {\n  filters {\n    index\n    name\n    displayName\n    value\n    multiSelectable\n    defaultParams {\n      age\n      gender\n      day\n      time\n      __typename\n    }\n    items {\n      index\n      name\n      value\n      selected\n      representative\n      displayName\n      clickCode\n      laimCode\n      type\n      icon\n      __typename\n    }\n    __typename\n  }\n  votingKeywordList {\n    items {\n      name\n      displayName\n      value\n      icon\n      clickCode\n      __typename\n    }\n    menuItems {\n      name\n      value\n      icon\n      clickCode\n      __typename\n    }\n    total\n    __typename\n  }\n  optionKeywordList {\n    items {\n      name\n      displayName\n      value\n      icon\n      clickCode\n      __typename\n    }\n    total\n    __typename\n  }\n  __typename\n}\n\nfragment RestaurantCommonFields on RestaurantListResult {\n  restaurantCategory\n  queryString\n  siteSort\n  selectedFilter {\n    order\n    rank\n    tvProgram\n    region\n    brand\n    menu\n    food\n    mood\n    purpose\n    sortingOrder\n    takeout\n    orderBenefit\n    cafeFood\n    day\n    time\n    age\n    gender\n    myPreference\n    hasMyPreference\n    cafeMenu\n    cafeTheme\n    theme\n    voting\n    filterOpening\n    keywordFilter\n    property\n    realTimeBooking\n    hours\n    __typename\n  }\n  rcodes\n  location {\n    sasX\n    sasY\n    __typename\n  }\n  total\n  __typename\n}\n\nfragment RestaurantBusinessItems on RestaurantListSummary {\n  categoryCodeList\n  visitorReviewCount\n  visitorReviewScore\n  imageUrls\n  bookingHubUrl\n  bookingHubButtonName\n  visitorImages {\n    id\n    reviewId\n    imageUrl\n    profileImageUrl\n    nickname\n    __typename\n  }\n  visitorReviews {\n    id\n    review\n    reviewId\n    __typename\n  }\n  foryouLabel\n  foryouTasteType\n  microReview\n  priceCategory\n  broadcastInfo {\n    program\n    date\n    menu\n    __typename\n  }\n  michelinGuide {\n    year\n    star\n    comment\n    url\n    hasGrade\n    isBib\n    alternateText\n    hasExtraNew\n    region\n    __typename\n  }\n  broadcasts {\n    program\n    menu\n    episode\n    broadcast_date\n    __typename\n  }\n  tvcastId\n  naverBookingCategory\n  saveCount\n  uniqueBroadcasts\n  isDelivery\n  deliveryArea\n  isCvsDelivery\n  isTableOrder\n  isPreOrder\n  isTakeOut\n  bookingDisplayName\n  bookingVisitId\n  bookingPickupId\n  popularMenuImages {\n    name\n    price\n    bookingCount\n    menuUrl\n    menuListUrl\n    imageUrl\n    isPopular\n    usePanoramaImage\n    __typename\n  }\n  newBusinessHours {\n    status\n    description\n    __typename\n  }\n  baemin {\n    businessHours {\n      deliveryTime {\n        start\n        end\n        __typename\n      }\n      closeDate {\n        start\n        end\n        __typename\n      }\n      temporaryCloseDate {\n        start\n        end\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  yogiyo {\n    businessHours {\n      actualDeliveryTime {\n        start\n        end\n        __typename\n      }\n      bizHours {\n        start\n        end\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  realTimeBookingInfo {\n    description\n    hasMultipleBookingItems\n    bookingBusinessId\n    bookingUrl\n    itemId\n    itemName\n    timeSlots {\n      date\n      time\n      timeRaw\n      available\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
        }
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "ko",
            "Content-Type": "application/json",
            "Referer": "https://pcmap.place.naver.com/restaurant/list?query=%EC%9D%8C%EC%8B%9D%EC%A0%90&x=126.9932954&y=37.5597363&clientX=126.99557&clientY=37.560153&bounds=126.9686406%3B37.5464503%3B127.0183795%3B37.5726797&display=70&ts=1731098318582&additionalHeight=76&mapUrl=https%3A%2F%2Fmap.naver.com%2Fp%2Fsearch%2F%EC%9D%8C%EC%8B%9D%EC%A0%90",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        }
        self.headers = {
            "accept": "*/*",
            "accept-language": "ko",
            "content-type": "application/json",
            "cookie": "NNB=XJPTVTNLP37GM; NAC=bePVCogHZm7GA; ba.uuid=deb38bb5-ae66-4df6-ae6f-91f5d3d682f9; ASID=788eb2870000019260636b770000004e; NaverSuggestUse=use%26unuse; nstore_session=ZkmrC0gB3Px+LRXictgZM2rL; nstore_pagesession=iyfOksqlt5IrissLrN0-411348; NFS=2; m_loc=c159640369d68ab7378efe3aac773590a2d4c58910edd80a1f011002fecd25a19ad31381f9fa1ab9515cfe20ccf4e553ad940333d619d2e339bb4c9e6fb4baf2540578e07e6954361a58f920a819a36f5c8dbe105af19ae6bb16d9b3d6067d403f83c88b60032c3d0ae5ceaaf63ca5e1; BUC=GFEDDTTz78fyEjTzdjd930zd_jbs8RCrw2pTbwMYwgs=",
            "origin": "https://pcmap.place.naver.com",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
            "x-wtm-graphql": "eyJhcmciOiLsnYzsi53soJAiLCJ0eXBlIjoicmVzdGF1cmFudCIsInNvdXJjZSI6InBsYWNlIn0"
        }

        response = requests.post(self.url, json=self.payload, headers=self.headers)
        self.total = response.json()['data']['restaurants']['total']

        self.platform_id = Platform.objects.get(name='naver').id
        self.places = []
        self.corner1_x = corner1_x
        self.corner1_y = corner1_y
        self.corner2_x = corner2_x
        self.corner2_y = corner2_y

        self.level = level
        self.indent = '    ' * level  # 들여쓰기 설정

        response = requests.post(self.url, json=self.payload, headers=self.headers)
        self.total = response.json()['data']['restaurants']['total']
        self.places = []

        print(f"{self.indent}레벨 {self.level} - 영역: ({corner1_x}, {corner1_y}), ({corner2_x}, {corner2_y})")

    def fetch_restaurants_page(self, start=1, max_display=100):
        self.payload['variables']['restaurantListInput']['start'] = start
        self.payload['variables']['restaurantListInput']['display'] = max_display
        response = requests.post(self.url, json=self.payload, headers=self.headers)
        return response.json()['data']['restaurants']['items']

    def get_all_restaurants_data(self):
        random_sleep = random.uniform(2.2, 3)
        time.sleep(random_sleep)

        print(f"{self.indent}총 {self.total}개의 음식점 발견")
        if self.total > 300:
            print(f"{self.indent}음식점 수가 300개를 초과하여 영역을 분할합니다.")
            mid_x = (self.corner1_x + self.corner2_x) / 2

            # 영역을 좌우로 분할
            left_crawler = NaverMapCrawler(self.corner1_x, self.corner1_y, mid_x, self.corner2_y, level=self.level + 1)
            self.places += left_crawler.get_all_restaurants_data()
            right_crawler = NaverMapCrawler(mid_x, self.corner1_y, self.corner2_x, self.corner2_y, level=self.level + 1)
            self.places += right_crawler.get_all_restaurants_data()
            total_places = len(self.places)
            print(f"{self.indent}레벨 {self.level} - 분할된 영역에서 총 {total_places}개의 음식점 수집 완료")
            return self.places
        else:
            places = []
            print(f"{self.indent}음식점 정보를 수집합니다...")
            for i in range(1, self.total + 1, 100):
                page_places = self.fetch_restaurants_page(i, 100)
                places += page_places
                print(f"{self.indent}  {len(places)}/{self.total}개의 음식점 수집 완료")
            print(f"{self.indent}레벨 {self.level} - 영역에서 총 {len(places)}개의 음식점 수집 완료")
            return places

    def save_places(self, restaurants_data):
        for place in restaurants_data:
            identifier = place['id']
            name = place['name']

            if RestaurantPlatformInfo.objects.filter(identifier=identifier, platform=self.platform_id).exists():
                print(f'{name} already exists')
                continue

            road_address = place['roadAddress']
            common_address = place['commonAddress']
            jibun_address = place['address']
            zip_code = None
            main_image_url = place['imageUrl']
            type = get_restaurant_type(place['category'])
            average_rating = None
            is_active = False
            # last_checked_at 에는 현재 날짜
            last_checked_at = timezone.now()
            summary_date = None

            latitude = place['y']
            longitude = place['x']
            description = get_description(identifier)

            restaurant = Restaurant(
                name=name,
                road_address=road_address,
                common_address=common_address,
                jibun_address=jibun_address,
                zip_code=zip_code,
                main_image_url=main_image_url,
                type=type,
                average_rating=average_rating,
                is_active=is_active,
                last_checked_at=last_checked_at,
                latitude=latitude,
                longitude=longitude,
                summary_date=summary_date
            )

            restaurant_platform_info = RestaurantPlatformInfo(
                restaurant=restaurant,
                platform=Platform.objects.get(name='naver'),
                description=description,
                identifier=identifier
            )

            restaurant.save()
            restaurant_platform_info.save()
            print(f'{name} saved')

def get_restaurant_type(name):
    if RestaurantType.objects.filter(type_name=name).exists():
        return RestaurantType.objects.get(type_name=name)
    else:
        return RestaurantType.objects.create(type_name=name)

def get_reviews():
    url = 'https://pcmap-api.place.naver.com/graphql'
    payload = {
        "operationName": "getVisitorReviews",
        "variables": {
            "input": {
                "businessId": "32872860",
                "businessType": "restaurant",
                "item": "0",
                "bookingBusinessId": None,
                "page": 3,
                "size": 10,
                "isPhotoUsed": False,
                "includeContent": True,
                "getUserStats": True,
                "includeReceiptPhotos": True,
                "cidList": [
                    "220036",
                    "220044",
                    "220134",
                    "220934"
                ],
                "getReactions": True,
                "getTrailer": True
            },
            "id": "38425640"
        },
        "query": "query getVisitorReviews($input: VisitorReviewsInput) {\n  visitorReviews(input: $input) {\n    items {\n      id\n      reviewId\n      rating\n      author {\n        id\n        nickname\n        from\n        imageUrl\n        borderImageUrl\n        objectId\n        url\n        review {\n          totalCount\n          imageCount\n          avgRating\n          __typename\n        }\n        theme {\n          totalCount\n          __typename\n        }\n        isFollowing\n        followerCount\n        followRequested\n        __typename\n      }\n      body\n      thumbnail\n      media {\n        type\n        thumbnail\n        thumbnailRatio\n        class\n        videoId\n        videoUrl\n        trailerUrl\n        __typename\n      }\n      tags\n      status\n      visitCount\n      viewCount\n      visited\n      created\n      reply {\n        editUrl\n        body\n        editedBy\n        created\n        date\n        replyTitle\n        isReported\n        isSuspended\n        status\n        __typename\n      }\n      originType\n      item {\n        name\n        code\n        options\n        __typename\n      }\n      language\n      highlightRanges {\n        start\n        end\n        __typename\n      }\n      apolloCacheId\n      translatedText\n      businessName\n      showBookingItemName\n      bookingItemName\n      votedKeywords {\n        code\n        iconUrl\n        iconCode\n        name\n        __typename\n      }\n      userIdno\n      loginIdno\n      receiptInfoUrl\n      reactionStat {\n        id\n        typeCount {\n          name\n          count\n          __typename\n        }\n        totalCount\n        __typename\n      }\n      hasViewerReacted {\n        id\n        reacted\n        __typename\n      }\n      nickname\n      showPaymentInfo\n      visitCategories {\n        code\n        name\n        keywords {\n          code\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    starDistribution {\n      score\n      count\n      __typename\n    }\n    hideProductSelectBox\n    total\n    showRecommendationSort\n    itemReviewStats {\n      score\n      count\n      itemId\n      starDistribution {\n        score\n        count\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
    }
    headers = {
        "Accept": "*/*",
        "Accept-Language": "ko",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    }

    response = requests.post(url, json=payload, headers=headers)
    print(json.dumps(response.json(), indent=4, ensure_ascii=False))

def get_description(id):
    random_sleep = random.uniform(2.2, 3)
    time.sleep(random_sleep)
    url = f'https://pcmap.place.naver.com/restaurant/{id}/home'
    # headers = {
    #     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    #     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    #     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
    # }
    headers = {
        "accept": "*/*",
        "accept-language": "ko",
        "content-type": "application/json",
        "cookie": "NNB=XJPTVTNLP37GM; NAC=bePVCogHZm7GA; ba.uuid=deb38bb5-ae66-4df6-ae6f-91f5d3d682f9; ASID=788eb2870000019260636b770000004e; NaverSuggestUse=use%26unuse; nstore_session=ZkmrC0gB3Px+LRXictgZM2rL; nstore_pagesession=iyfOksqlt5IrissLrN0-411348; NFS=2; m_loc=c159640369d68ab7378efe3aac773590a2d4c58910edd80a1f011002fecd25a19ad31381f9fa1ab9515cfe20ccf4e553ad940333d619d2e339bb4c9e6fb4baf2540578e07e6954361a58f920a819a36f5c8dbe105af19ae6bb16d9b3d6067d403f83c88b60032c3d0ae5ceaaf63ca5e1; BUC=GFEDDTTz78fyEjTzdjd930zd_jbs8RCrw2pTbwMYwgs=",
        "origin": "https://pcmap.place.naver.com",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "x-wtm-graphql": "eyJhcmciOiLsnYzsi53soJAiLCJ0eXBlIjoicmVzdGF1cmFudCIsInNvdXJjZSI6InBsYWNlIn0"
    }

    response = requests.get(url, headers=headers)
    response.encoding = 'utf-8'
    pattern = r'window\.__APOLLO_STATE__\s*=\s*(\{.*?\})\s*;'
    match = re.search(pattern, response.text, re.S)
    if match:
        json_str = match.group(1)
        try:
            config_data = json.loads(json_str)
            for key in config_data.get('ROOT_QUERY', {}):
                if key.startswith('placeDetail('):
                    description = config_data['ROOT_QUERY'][key].get('description({"source":["shopWindow"]})', '설명 없음')
                    return description
        except json.JSONDecodeError as e:
            print(f"JSON 변환 오류: {e}")
    else:
        print(response.text)
        print("JSON 데이터를 찾을 수 없습니다.")


def fetch_reviews(identifier_id: str, page=1):
    url = 'https://pcmap-api.place.naver.com/graphql'
    payload = [
        {
            "operationName": "getVisitorReviews",
            "variables": {
                "input": {
                    "businessId": f"{identifier_id}",
                    "businessType": "restaurant",
                    "page": page,
                    "size": 50,
                    "isPhotoUsed": False,
                    "includeContent": True,
                    "getUserStats": True,
                    "includeReceiptPhotos": True,
                    "getReactions": True,
                    "getTrailer": True,
                    "sort": "recent"
                },
                "id": f"{identifier_id}"
            },
            "query": "query getVisitorReviews($input: VisitorReviewsInput) {\n  visitorReviews(input: $input) {\n    items {\n      id\n      reviewId\n      rating\n      author {\n        id\n        nickname\n        from\n        imageUrl\n        borderImageUrl\n        objectId\n        url\n        review {\n          totalCount\n          imageCount\n          avgRating\n          __typename\n        }\n        theme {\n          totalCount\n          __typename\n        }\n        isFollowing\n        followerCount\n        followRequested\n        __typename\n      }\n      body\n      thumbnail\n      media {\n        type\n        thumbnail\n        thumbnailRatio\n        class\n        videoId\n        videoUrl\n        trailerUrl\n        __typename\n      }\n      tags\n      status\n      visitCount\n      viewCount\n      visited\n      created\n      reply {\n        editUrl\n        body\n        editedBy\n        created\n        date\n        replyTitle\n        isReported\n        isSuspended\n        status\n        __typename\n      }\n      originType\n      item {\n        name\n        code\n        options\n        __typename\n      }\n      language\n      highlightRanges {\n        start\n        end\n        __typename\n      }\n      apolloCacheId\n      translatedText\n      businessName\n      showBookingItemName\n      bookingItemName\n      votedKeywords {\n        code\n        iconUrl\n        iconCode\n        name\n        __typename\n      }\n      userIdno\n      loginIdno\n      receiptInfoUrl\n      reactionStat {\n        id\n        typeCount {\n          name\n          count\n          __typename\n        }\n        totalCount\n        __typename\n      }\n      hasViewerReacted {\n        id\n        reacted\n        __typename\n      }\n      nickname\n      showPaymentInfo\n      visitCategories {\n        code\n        name\n        keywords {\n          code\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    starDistribution {\n      score\n      count\n      __typename\n    }\n    hideProductSelectBox\n    total\n    showRecommendationSort\n    itemReviewStats {\n      score\n      count\n      itemId\n      starDistribution {\n        score\n        count\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
        }
    ]
    headers = {
        "accept": "*/*",
        "accept-language": "ko",
        "content-type": "application/json",
        "origin": "https://pcmap.place.naver.com",
        "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "x-wtm-graphql": "eyJhcmciOiIxODIwNDE5NTk0IiwidHlwZSI6InJlc3RhdXJhbnQiLCJzb3VyY2UiOiJwbGFjZSJ9"
    }
    cookies = {
        # 'NNB': ''
        'NNB': 'XJPTVTNLP37GM',
        'NAC': 'bePVCogHZm7GA',
        'ba.uuid': 'deb38bb5-ae66-4df6-ae6f-91f5d3d682f9',
        'ASID': '788eb2870000019260636b770000004e',
        'NaverSuggestUse': 'use%26unuse',
        'nstore_session': 'ZkmrC0gB3Px+LRXictgZM2rL',
        'nstore_pagesession': 'iyfOksqlt5IrissLrN0-411348',
        'NFS': '2',
        'm_loc': 'c159640369d68ab7378efe3aac773590a2d4c58910edd80a1f011002fecd25a19ad31381f9fa1ab9515cfe20ccf4e553ad940333d619d2e339bb4c9e6fb4baf2540578e07e6954361a58f920a819a36f5c8dbe105af19ae6bb16d9b3d6067d403f83c88b60032c3d0ae5ceaaf63ca5e1',
        'BUC': 'Vfa5Np6oU8DBaFzeHTA3LeEcVMdoVryqeC47uHgEEqg='
    }

    response = requests.post(url, headers=headers, json=payload, cookies=cookies)
    try:
        return response.json()
    except json.JSONDecodeError as e:
        print(f"JSON 변환 오류: {e}")
        print(response.text)


def fetch_and_store_restaurant_reviews(info: RestaurantPlatformInfo):
    max_reviews = 300
    current_page = 1
    total_item_number = None
    platform = Platform.objects.get(name='naver')
    saved_reviews = 0
    restaurant_name = info.restaurant.name

    while saved_reviews < max_reviews:
        data = fetch_reviews(info.identifier, current_page)
        items = data[0]['data']['visitorReviews']['items']
        if total_item_number is None:
            total_item_number = data[0]['data']['visitorReviews']['total']
            max_reviews = min(max_reviews, total_item_number)

        for i in range(len(items)):
            item = items[i]
            if saved_reviews >= max_reviews:
                break

            author_id = item['author']['objectId']
            nickname = item['author']['nickname']
            if item['author']['review'] is None:
                print(f'{restaurant_name}: 사용자 리뷰 정보가 없는 리뷰가 있습니다. f{author_id} {nickname}')
                print(f'{restaurant_name}: 데이터를 새로 받아옵니다.')
                data = fetch_reviews(info.identifier, current_page)
                items = data[0]['data']['visitorReviews']['items']
                i -= 1
                continue
            author_avg_score = item.get('author', {}).get('review', {}).get('avgRating', 0.0)  # 기본값 0 설정
            author_review_count = item.get('author', {}).get('review', {}).get('totalCount', 0)  # 기본값 0 설정

            author, _ = ReviewAuthor.objects.get_or_create(
                author_platform_id=author_id,
                platform=platform,
                defaults={
                    'nickname': nickname,
                    'average_rating': author_avg_score,
                    'review_count': author_review_count
                }
            )

            restaurant = info.restaurant
            content = item['body']
            score = item['rating']
            created_at = parse_date_string(item['created'])
            has_reply = item['reply']['body'] is not None
            has_image = len(item['media']) > 0
            likes_count = item['reactionStat']['totalCount']
            manual_label_attempted = False

            review = Review(
                restaurant=restaurant,
                author=author,
                content=content,
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
                saved_reviews += 1
                review.save()
                print(f'{restaurant_name}: {saved_reviews}/{max_reviews}개의 리뷰를 저장했습니다. ({saved_reviews / max_reviews * 100:.2f}%)')

        random_sleep = random.uniform(2.4, 3)
        time.sleep(random_sleep)
        current_page += 1
        if len(items) < 50:
            break

    info.last_updated = datetime.now()
    info.save()


def parse_date_string(date_string):
    current_year = datetime.now().year

    # 연도가 포함된 경우
    if '.' in date_string and date_string.count('.') == 3:
        # 요일 부분을 제거하고 날짜만 파싱
        date_string = '.'.join(date_string.split('.')[:3])  # "21.10.10"
        parsed_date = datetime.strptime(date_string, "%y.%m.%d")
        # 시간을 0시 0분 0초로 설정
        return parsed_date.replace(hour=0, minute=0, second=0)

    # 연도가 생략된 경우
    if '.' in date_string and date_string.count('.') == 2:
        # 현재 연도를 추가하고 요일 부분 제거
        date_string_with_year = f"{current_year}.{date_string.split('.')[0]}.{date_string.split('.')[1]}"
        parsed_date = datetime.strptime(date_string_with_year, "%Y.%m.%d")
        # 시간을 0시 0분 0초로 설정
        return parsed_date.replace(hour=0, minute=0, second=0)

    return None


def fetch_and_store_restaurants_reviews(*args):
    platform = Platform.objects.get(name='naver')
    restaurant_platform_infos = RestaurantPlatformInfo.objects.filter(platform=platform, last_updated__isnull=True)

    if len(args) == 1:
        count = int(args[0])
        restaurant_platform_infos = restaurant_platform_infos[:count]

    print(f'총 {len(restaurant_platform_infos)}개의 음식점 리뷰를 저장합니다.\n')
    for restaurant_platform_info in restaurant_platform_infos:
        restaurant_name = restaurant_platform_info.restaurant.name
        print(f'{restaurant_name}의 리뷰 저장을 시작합니다.')
        fetch_and_store_restaurant_reviews(restaurant_platform_info)
        print(f'{restaurant_name}의 리뷰를 모두 저장했습니다.')
        print()


def process():
    try:
        fetch_and_store_restaurants_reviews()
    except KeyboardInterrupt as e:
        print("사용자에 의해 프로세스가 중단되었습니다.")
    except Exception as e:
        print(f"문제가 발생했습니다. {e}")
        traceback.print_exc()


if __name__ == '__main__':
    process()

# reviews = Review.objects.all()[:100]
# for review in reviews:
#     print(review.content)

# crawler = NaverMapCrawler(126.992633, 37.560078, 127.002761, 37.567290)
# places = crawler.get_all_restaurants_data()
# crawler.save_places(places)