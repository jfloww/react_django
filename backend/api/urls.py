from django.urls import path
from .views import hello_world
from .views import getSampleData

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('getData/', getSampleData, name='getSampleData'),
]
