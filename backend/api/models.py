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


class BaseModel(models.Model):
    description = models.CharField(
        verbose_name='Описание',
        null=True,
    )

    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        abstract = True


class Equipment(BaseModel):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Наименование',
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

    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Единица снаряжения'
        verbose_name_plural = 'Снаряжение'

    def __str__(self):
        return self.name


# --------------------------ReservingCart-----------------------------------
class ReservingCart(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        related_name='reservingcart',
    )

    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения'
    )

    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['user']
        verbose_name = 'Карта резервирования'
        verbose_name_plural = 'Карты резервирования'

    def __str__(self):
        return f'{self.user}'


# -------------------------Reservation------------------------------
class Reservation(BaseModel):
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения',
        related_name='reservation_equipment',
    )

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
        null=True,
    )

    description = models.CharField(
        verbose_name='Описание',
        null=True,
    )

    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['equipment']
        verbose_name = 'Зарезервированная/выданная единица снаряжения'
        verbose_name_plural = 'Зарезервированное/выданное снаряжение'

    def __str__(self):
        return f'{self.equipment} {self.user}'


# -------------------------History------------------------------
class HistoryEquipment(BaseModel):
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        verbose_name='Единица снаряжения',
        related_name='history_equipment',
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )

    date_take = models.DateTimeField(
        verbose_name='Дата выдачи',
    )

    date_return = models.DateTimeField(
        verbose_name='Дата сдачи',
        null=False,
    )

    description = models.CharField(
        verbose_name='Описание',
        null=True,
    )

    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        null=False,
    )

    class Meta:
        ordering = ['equipment']
        verbose_name = 'История использования снаряжения'
        verbose_name_plural = 'История использования снаряжения'

    def __str__(self):
        return f'{self.equipment} {self.user}'
