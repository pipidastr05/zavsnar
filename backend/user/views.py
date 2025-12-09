from django.contrib.auth import get_user_model
from djoser.views import UserViewSet as DjoserUserViewSet

from .serializers import UserCartSerializer


User = get_user_model()


class FoodgramUserViewSet(DjoserUserViewSet):

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['retrieve', 'me']:
            return UserCartSerializer
        return super().get_serializer_class(*args, **kwargs)
