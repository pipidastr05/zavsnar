from datetime import datetime

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet

from .models import (
    Category,
    Equipment,
    HistoryEquipment,
    ReservingCart,
    Reservation,
    )


@admin.action(description="Выдать")
def issue(modeladmin, request, queryset):
    queryset.update(status=True, date_take=datetime.now())


@admin.action(description="Принять")
def accept(modeladmin, request, queryset):
    for reservation in queryset:
        HistoryEquipment.objects.create(
            equipment=reservation.equipment,
            user=reservation.user,
            date_take=reservation.date_take,
            description=reservation.description,
            amount=reservation.amount,
            date_return=datetime.now(),
        )
        # Удаляем reservation
        reservation.delete()


class EquipmentAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'category',
        'description',
        'amount',
    )
    search_fields = ('name',)
    list_filter = ('category',)


# ------------------------Reservation--------------------------------
class ReservationAdmin(admin.ModelAdmin):

    list_display = (
        'equipment',
        'user',
        'status',
        'date_take',
        'amount',
        'description',
        'id',
    )
    search_fields = ('equipment',)
    list_filter = ('status',)
    actions = [issue, accept]


class HistoryEquipmentAdmin(admin.ModelAdmin):

    list_display = (
        'equipment',
        'user',
        'date_take',
        'date_return',
        'amount',
        'description',
    )
    search_fields = ('equipment', 'user')


admin.site.register(Category)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(HistoryEquipment, HistoryEquipmentAdmin)
