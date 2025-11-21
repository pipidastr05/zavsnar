from django.urls import include, path
from rest_framework import routers

from .views import FoodgramUserViewSet


router = routers.DefaultRouter()
router.register('users', FoodgramUserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    # JWT-эндпоинты, для управления JWT-токенами:
    path('', include('djoser.urls.jwt')),
] 
'''urlpatterns = [
    # базовые, для управления пользователями в Django:
    path('', include('djoser.urls')),'''
