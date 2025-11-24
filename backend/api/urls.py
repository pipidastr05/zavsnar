from django.urls import include, path
from rest_framework import routers

from .views import (
    CategoryViewSet,
    EquipmentViewSet,
    ReservingCartViewSet,
)


router = routers.DefaultRouter()
router.register('category', CategoryViewSet, basename='category')
router.register('equipment', EquipmentViewSet, basename='equipment')
router.register(
    'reservingcart', ReservingCartViewSet, basename='reservingcart'
)
'''router.register(
    r'users/(?P<user_id>\d+)/reservingcart',
    ReservingCartViewSet,
    basename='reservingcart'
)'''

urlpatterns = [
    path('', include(router.urls)),
]