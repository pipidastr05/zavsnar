from django.contrib.auth import get_user_model
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework import serializers


from .filters import EquipmentFilter, EquipmentNameSearchFilter
from .models import (
    Category,
    Equipment,
    Reservation,
)
from .permission import IsAuthor
from .serializers import (
    CategorySerializer,
    EquipmentSerializer,
    EquipmentCartSerializer,
    ReservationPOSTSerializer,
    ReservingCartSerializer,
)


User = get_user_model()


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Equipment.objects.all()
    pagination_class = LimitOffsetPagination
    filter_backends = [DjangoFilterBackend,  filters.SearchFilter]
    filterset_class = EquipmentFilter
    search_fields = ['^name',]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EquipmentCartSerializer
        return EquipmentSerializer


class ReservingCartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthor,]

    def get_queryset(self):
        return self.request.user.reservingcart.all()

    def get_serializer_class(self):
        if self.action == 'reserv':
            return ReservationPOSTSerializer
        return ReservingCartSerializer

    @action(
        detail=False,
        methods=['post'],
        url_path='reserv'
    )
    def reserv(self, request):
        """Метод резервирования."""
        queryset = self.get_queryset().annotate(reserv_amount=Sum(
            'equipment__reservation_equipment__amount'
        ))
        print(queryset)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            description = serializer.validated_data.get('description')
            objects_to_create = []
            for reserv_card in queryset:
                total_amount = reserv_card.equipment.amount
                reserv_amount = reserv_card.reserv_amount
                if (  # reserv_card > (total_amount - reserv_amount)
                        reserv_amount and reserv_card.amount
                        > (total_amount - reserv_amount)
                        or reserv_card.amount > total_amount
                ):
                    raise serializers.ValidationError(
                        'Нельзя добавить снаряжение: '
                        + f'{reserv_card.equipment.name}'
                        + ' в карточку резервирования больше'
                        + ' чем есть в наличии'
                    )
                objects_to_create.append(Reservation(
                    user=reserv_card.user,
                    equipment=reserv_card.equipment,
                    amount=reserv_card.amount,
                    description=description,
                    status=False))
            Reservation.objects.bulk_create(objects_to_create)
            '''for reserv_card in queryset:
                Reservation.objects.create(
                    user=reserv_card.user,
                    equipment=reserv_card.equipment,
                    amount=reserv_card.amount,
                    description=description,
                    status=False
                )'''
            queryset.delete()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
