from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .models import (
    Category,
    Equipment,
    HistoryEquipment,
    Reservation,
    ReservingCart,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')


class EquipmentSerializer(serializers.ModelSerializer):
    amount_reserved = serializers.SerializerMethodField(read_only=True)
    amount_issued = serializers.SerializerMethodField(read_only=True)
    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )

    class Meta:
        model = Equipment
        fields = (
            'id',
            'name',
            'category',
            'description',
            'amount',
            'amount_reserved',
            'amount_issued',
        )

    def amount_reserved_issued_get(self, obj, flag):
        """Метод получения значения количества"""
        return Reservation.objects.filter(
            equipment=obj,
            status=flag,
        ).aggregate(sum=Sum('amount'))['sum']

    def get_amount_reserved(self, obj):
        return self.amount_reserved_issued_get(obj, False) or 0

    def get_amount_issued(self, obj):
        return self.amount_reserved_issued_get(obj, True) or 0


class HistoryForEquipmentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='last_name',
    )

    class Meta:
        model = HistoryEquipment
        fields = (
            'id', 'date_take', 'date_return', 'user', 'amount', 'description'
        )


class EquipmentCartSerializer(EquipmentSerializer):
    history = serializers.SerializerMethodField(read_only=True)
    # history = HistoryForEquipmentSerializer(required=True, many=True)

    class Meta:
        model = Equipment
        fields = (
            'id',
            'name',
            'category',
            'description',
            'amount',
            'amount_reserved',
            'amount_issued',
            'history',
        )

    def get_history(self, obj):
        history = HistoryEquipment.objects.filter(equipment=obj,)
        serializer = HistoryForEquipmentSerializer(history, many=True)
        return serializer.data


class ReservingCartSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='last_name',
    )

    class Meta:
        model = ReservingCart
        fields = ('id', 'user', 'equipment', 'amount',)

    def to_representation(self, obj):
        request = self.context['request']
        if request.method == 'GET':
            self.fields['equipment'] = EquipmentSerializer(read_only=True)
        obj = super().to_representation(obj)
        return obj

    def create(self, validated_data):
        """Метод добавления записи в карточку резервирования"""
        validated_data['user'] = self.context['request'].user
        equipment_reserv = ReservingCart.objects.create(**validated_data)
        return equipment_reserv

    def validate(self, attrs):
        equipment = attrs.get('equipment')
        amount = attrs.get('amount')
        #print(type(equipment_id))
        #equipment = get_object_or_404(Equipment, id=equipment_id)
        total_amount = equipment.amount
        reserv_amount = Reservation.objects.filter(
            equipment=equipment,
        ).aggregate(sum=Sum('amount'))['sum']
        if (
                reserv_amount and amount > (total_amount - reserv_amount)
                or amount > total_amount
        ):
            raise serializers.ValidationError(
                f'Нельзя добавить снаряжение: {equipment.name} '
                + 'в карточку резервирования больше чем есть в наличии')
        request = self.context['request']
        user = request.user
        if request.method == 'POST':
            reservation_exists = ReservingCart.objects.filter(
                user__exact=user,
                equipment__exact=equipment,
            ).exists()
            print(reservation_exists)
            if reservation_exists:
                raise serializers.ValidationError(
                    'Такое снаряжение уже есть в вашей карточке резервировани.'
                    ' Если требуется больше просто увеличьте количество.'
                )
        return super().validate(attrs)


class ReservationPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('description',)
