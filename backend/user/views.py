from django.contrib.auth import get_user_model
from djoser.views import UserViewSet as DjoserUserViewSet

from .serializers import UserCartSerializer, UserSerializer


User = get_user_model()


class FoodgramUserViewSet(DjoserUserViewSet):

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'retrieve':
            return UserCartSerializer
        return super().get_serializer_class(*args, **kwargs)
