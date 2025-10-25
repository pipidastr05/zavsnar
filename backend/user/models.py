from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'father_name']
    father_name = models.CharField(max_length=100, verbose_name='Отчество',)
    phone_number = models.CharField(
        null=False,
        blank=False,
        unique=True,
        verbose_name='Номер телефона',
    )

    class Meta:
        ordering = ['last_name']
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.last_name
