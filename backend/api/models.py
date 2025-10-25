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

    class Meta:
        ordering = ['name']
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Equipment(models.Model):
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
        ordering = ['name']
        verbose_name = 'Единица снаряжения'
        verbose_name_plural = 'Единичное снаряжение'

    def __str__(self):
        return self.name


class EquipmentMany(Equipment):
    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Единица снаряжения'
        verbose_name_plural = 'Количественное снаряжение'


class Rope(Equipment):
    length = models.IntegerField(
        verbose_name='Длина',
        null=False,
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Верёвка'
        verbose_name_plural = 'Верёвки'


# -------------------------Reservation------------------------------
class BaseReservation(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )

    status = models.BooleanField(
        verbose_name='Выдано',
        help_text='Поставьте галочку, если снаряжение выдано.',
        null=False,
    )

    date_take = models.DateTimeField(
        verbose_name='Дата выдачи',
    )

    class Meta:
        abstract = True


class Reservation(BaseReservation):
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )

    class Meta:
        ordering = ['equipment']
        verbose_name = 'Зарезервированная/выданная единица снаряжения'
        verbose_name_plural = 'Зарезервированное/выданное единичное снаряжение'

    def __str__(self):
        return f'{self.equipment} {self.user}'


class ReservationRope(BaseReservation):
    rope = models.ForeignKey(
        Rope,
        on_delete=models.CASCADE,
        verbose_name='Верёвка'
    )

    class Meta:
        ordering = ['rope']
        verbose_name = 'Зарезервированная/выданная верёвка'
        verbose_name_plural = 'Зарезервированная/выданная верёвка'

    def __str__(self):
        return f'{self.rope} {self.user}'


class ReservationMany(BaseReservation):
    equipment_many = models.ForeignKey(
        EquipmentMany,
        on_delete=models.CASCADE,
        verbose_name='Снаряжение',
        null=False,
    )

    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['equipment_many']
        verbose_name = 'Зарезервированная/выданная единица снаряжения'
        verbose_name_plural = 'Зарезервированное/выданное количественное снаряжение'

    def __str__(self):
        return f'{self.equipment_many} {self.user}'


# -------------------------History------------------------------
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
        null=False,
    )

    class Meta:
        abstract = True


class HistoryEquipment(BaseHistory):
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )

    class Meta:
        ordering = ['equipment']
        verbose_name = 'Единица снаряжения'
        verbose_name_plural = 'Единичное снаряжение'

    def __str__(self):
        return f'{self.equipment} {self.user}'


class HistoryRope(BaseHistory):
    rope = models.ForeignKey(
        Rope,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )

    class Meta:
        ordering = ['rope']
        verbose_name = 'Верёвка'
        verbose_name_plural = 'Верёвки'

    def __str__(self):
        return f'{self.rope} {self.user}'


class HistoryEquipmentMany(BaseHistory):
    equipment_many = models.ForeignKey(
        EquipmentMany,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )

    amount = models.IntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['equipment_many']
        verbose_name = 'Единица снаряжения'
        verbose_name_plural = 'Количественное снаряжение'

    def __str__(self):
        return f'{self.equipment_many} {self.user}'
