from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USERNAME_FIELD = 'phone_number'
    father_name = models.CharField(max_length=100, verbose_name='Отчество')
    phone_number = models.IntegerField(verbose_name='Номер телефона')
