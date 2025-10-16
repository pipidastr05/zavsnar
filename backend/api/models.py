from django.contrib.auth import get_user_model
from django.db import models


User = get_user_model()


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Категория',
        null=False
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name='Слаг категории',
        null=False
    )


class BaseEquipment(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Имя',
        null=False,
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        verbose_name='Категория',
        null=False,
    )

    description = models.CharField(
        verbose_name='Описание',
        null=True,
    )

    class Meta:
        abstract = True


class Equipment(BaseEquipment):
    status = models.PositiveSmallIntegerField(
        verbose_name='Статус',
        null=False,
    )


class EquipmentMany(BaseEquipment):
    amount = models.IntegerField(
        verbose_name='Количество',
        null=False,
    )


class Rope(Equipment):
    length = models.IntegerField(
        verbose_name='Длина',
        null=False,
    )


class ReservationMany(models.Model):
    equipment_many = models.ForeignKey(
        EquipmentMany,
        on_delete=models.CASCADE,
        verbose_name='Снаряжение',
        null=False,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )

    amount = models.IntegerField(
        verbose_name='Количество',
        null=False,
    )

    status = models.BooleanField(
        verbose_name='Статус',
        null=False,
    )


class BaseHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )

    date_take = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата выдачи',
    )

    date_return = models.DateTimeField(
        verbose_name='Дата сдачи',
        null=True,
    )

    class Meta:
        abstract = True


class HistoryEquipment(BaseHistory):
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )


class HistoryRope(BaseHistory):
    rope = models.ForeignKey(
        Rope,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )


class HistoryEquipmentMany(BaseHistory):
    equipment_many = models.ForeignKey(
        EquipmentMany,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )
