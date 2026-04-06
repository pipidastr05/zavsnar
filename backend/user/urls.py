from django.urls import include, path
from rest_framework import routers

from .views import SessionLoginView, SessionLogoutView, UserViewSet


router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', SessionLoginView.as_view(), name='session-login'),
    path('logout/', SessionLogoutView.as_view(), name='session-logout'),

] 
'''urlpatterns = [
    # базовые, для управления пользователями в Django:
    path('', include('djoser.urls')),'''

'''# JWT-эндпоинты, для управления JWT-токенами:
    path('', include('djoser.urls.jwt')),
    path('', include('rest_framework.urls'))'''