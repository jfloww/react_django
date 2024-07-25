from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    param = request.query_params.get('connect', None)
    print(param)  # 디버깅 목적으로 param 값을 출력합니다.
    return Response({"message": "Hello, world!"})

import random
from datetime import datetime, timedelta

def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

def get_random_name(names_usage, max_usage_per_name):
    available_names = [name for name, count in names_usage.items() if count < max_usage_per_name]
    chosen_name = random.choice(available_names)
    names_usage[chosen_name] += 1
    return chosen_name

@api_view(['GET'])
def getSampleData(request):
    data_count = 250
    max_usage_per_name = 4
    required_names = (data_count // max_usage_per_name) + 1
    names_pool = [f'company{i}' for i in range(1, required_names + 1)]  # Ensure enough names
    names_usage = {name: 0 for name in names_pool}

    roles = ['Software Engineer', 'Dev Ops', 'Full Stack Developer', 'Backend Engineer', 'Frontend Engineer']
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 7, 23)
    location_info = ['New York, New York', 'Jersey City, New Jersey', 'Philadelphia, Pennsylvania', 'Washington D.C.', 'Los Angeles, California', 'Austin, Texas', 'San Jose, California']
    sample_data = []

    for _ in range(data_count):
        name = get_random_name(names_usage, max_usage_per_name)
        role = random.choice(roles)
        applied_date = random_date(start_date, end_date).strftime('%Y-%m-%d')
        location = random.choice(location_info)
        sample_data.append({
            'name': name,
            'role': role,
            'applied': applied_date,
            'location': location
        })
    return Response(sample_data)

# @api_view(['GET'])
# def getData(request):