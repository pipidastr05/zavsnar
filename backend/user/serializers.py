from django.contrib.auth import get_user_model
from rest_framework import serializers

from api.models import HistoryEquipment, Reservation
from api.serializers import EquipmentSerializer


User = get_user_model()


class ReservationForUserSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)

    class Meta():
        model = Reservation
        fields = (
            'id', 'date_take', 'equipment', 'amount', 'description'
        )


class HistoryForUserSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)

    class Meta:
        model = HistoryEquipment
        fields = (
            'id', 'date_take', 'date_return',
            'equipment', 'amount', 'description'
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta():
        model = User
        fields = (
            'id',
            'phone_number',
            'email',
            'username',
            'first_name',
            'last_name',
            'father_name',
        )


class UserCartSerializer(serializers.ModelSerializer):
    reserved = serializers.SerializerMethodField(read_only=True)
    issued = serializers.SerializerMethodField(read_only=True)
    history = serializers.SerializerMethodField(read_only=True)

    class Meta():
        model = User
        fields = (
            'id',
            'phone_number',
            'email',
            'username',
            'first_name',
            'last_name',
            'father_name',
            'reserved',
            'issued',
            'history',
        )

    def reserved_issued_get(self, obj, flag):
        equipments = Reservation.objects.filter(
            user=obj,
            status=flag,
        )
        serializer = ReservationForUserSerializer(equipments, many=True)
        return serializer.data

    def get_reserved(self, obj):
        return self.reserved_issued_get(obj, False)

    def get_issued(self, obj):
        return self.reserved_issued_get(obj, True)

    def get_history(self, obj):
        history = HistoryEquipment.objects.filter(user=obj,)
        serializer = HistoryForUserSerializer(history, many=True)
        return serializer.data
