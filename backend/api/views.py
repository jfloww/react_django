from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request ):
    param = request.query_params.get('connect',None)
    print(param)
    return Response({"message": "Hello, world!"})


# Create your views here.
