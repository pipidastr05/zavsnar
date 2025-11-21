from django_filters import rest_framework
from rest_framework.filters import SearchFilter

from .models import Category, Equipment


class EquipmentNameSearchFilter(SearchFilter):
    search_param = 'name'


class EquipmentFilter(rest_framework.FilterSet):
    category = rest_framework.filters.ModelMultipleChoiceFilter(
        field_name='category__slug',
        to_field_name='slug',
        queryset=Category.objects.all(),
    )

    class Meta:
        model = Equipment
        fields = ['category',]
