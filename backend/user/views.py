from django.contrib.auth import (
    authenticate, get_user_model, login, logout
)
from djoser.views import UserViewSet as DjoserUserViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserCartSerializer


User = get_user_model()


class UserViewSet(DjoserUserViewSet):

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['retrieve', 'me']:
            return UserCartSerializer
        return super().get_serializer_class(*args, **kwargs)


class SessionLoginView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')

        if not phone_number or not password:
            return Response(
                {'error': 'Отсутсвует номер телефона и/или пароль'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            request, phone_number=phone_number, password=password
        )
        if user is not None:
            login(request, user)
            return Response({
                'message': 'Logged in successfully',
                'user_id': user.id,
                'username': user.username
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class SessionLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out'})
