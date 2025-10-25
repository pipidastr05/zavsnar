from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet

from .models import (
    Category,
    Equipment,
    EquipmentMany,
    HistoryEquipment,
    HistoryEquipmentMany,
    HistoryRope,
    Reservation,
    ReservationMany,
    ReservationRope,
    Rope,
    )


class EquipmentAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'category',
        'description',
    )
    search_fields = ('name',)
    list_filter = ('category',)


class EquipmentManyAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'category',
        'description',
        'amount',
    )
    search_fields = ('name',)
    list_filter = ('category',)


class RopeAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'category',
        'description',
        'length',
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
    )
    search_fields = ('equipment',)
    list_filter = ('status',)
    list_editable = ('status',)


class ReservationManyAdmin(admin.ModelAdmin):

    list_display = (
        'equipment_many',
        'user',
        'amount',
        'status',
        'date_take',
    )
    search_fields = ('equipment_many',)
    list_filter = ('status',)
    list_editable = ('status',)


class ReservationRopeAdmin(admin.ModelAdmin):

    list_display = (
        'rope',
        'user',
        'status',
        'date_take',
    )
    search_fields = ('rope',)
    list_filter = ('status',)
    list_editable = ('status',)


admin.site.register(Category)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(EquipmentMany, EquipmentManyAdmin)
admin.site.register(Rope, RopeAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(ReservationMany, ReservationManyAdmin)
admin.site.register(ReservationRope, ReservationRopeAdmin)
