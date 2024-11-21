import re
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def calculate_similarity(string1, string2):
    # 문자열을 음절 단위로 분리하고 띄어쓰기를 제거
    syllables1 = [char for char in string1 if char != ' ']
    syllables2 = [char for char in string2 if char != ' ']

    # 일치하는 음절 찾기
    matching_syllables = set(syllables1) & set(syllables2)
    total_syllables = set(syllables1) | set(syllables2)

    # 유사도 계산
    similarity = len(matching_syllables) / len(total_syllables) if total_syllables else 1
    return similarity


def subtract_months(dt, months):
    year = dt.year
    month = dt.month - months
    while month <= 0:
        month += 12
        year -= 1
    day = dt.day
    # 해당 월의 마지막 날 계산
    try:
        last_day_of_month = (datetime(year, month + 1, 1) - timedelta(days=1)).day
    except ValueError:
        last_day_of_month = 31
    if day > last_day_of_month:
        day = last_day_of_month
    return dt.replace(year=year, month=month, day=day)


def subtract_years(dt, years):
    try:
        return dt.replace(year=dt.year - years)
    except ValueError:
        # 윤년이 아닌 경우 2월 28일로 설정
        return dt.replace(year=dt.year - years, month=2, day=28)


def get_date_from_string(s):
    s = s.split(',')[0]
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    if s == '오늘':
        result_date = today
    elif s == '어제':
        result_date = today - timedelta(days=1)
    elif s == '그제':
        result_date = today - timedelta(days=2)
    elif s == '이번 주':
        # 이번 주의 첫째 날(월요일)을 계산
        weekday = today.weekday()  # 월요일이 0
        result_date = today - timedelta(days=weekday)
    elif s == '지난 주':
        # 지난 주의 첫째 날을 계산
        weekday = today.weekday()
        result_date = today - timedelta(days=weekday + 7)
    elif s == '이번 달':
        result_date = today.replace(day=1)
    elif s == '지난 달':
        first_day_this_month = today.replace(day=1)
        last_month_last_day = first_day_this_month - timedelta(days=1)
        result_date = last_month_last_day.replace(day=1)
    elif s == '작년':
        result_date = subtract_years(today, 1)
    elif s == '재작년':
        result_date = subtract_years(today, 2)
    else:
        month_match = re.match(r'(\d+)개월 전', s)
        year_match = re.match(r'(\d+)년 전', s)
        if month_match:
            N = int(month_match.group(1))
            result_date = subtract_months(today, N)
        elif year_match:
            N = int(year_match.group(1))
            result_date = subtract_years(today, N)
        else:
            raise ValueError("지원하지 않는 입력입니다.")
    return result_date

def parse_date_string_coupang_eats(s):
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    if s == '오늘':
        return today
    elif re.match(r'\d+일 전', s):
        days_ago = int(re.match(r'(\d+)일 전', s).group(1))
        return today - timedelta(days=days_ago)
    elif re.match(r'\d+주 전', s):
        weeks_ago = int(re.match(r'(\d+)주 전', s).group(1))
        return today - timedelta(weeks=weeks_ago)
    elif re.match(r'\d+달 전', s):
        months_ago = int(re.match(r'(\d+)달 전', s).group(1))
        return today - relativedelta(months=months_ago)
    elif re.match(r'\d+년 전', s):
        years_ago = int(re.match(r'(\d+)년 전', s).group(1))
        return today - relativedelta(years=years_ago)
    else:
        raise ValueError("지원하지 않는 입력입니다.")