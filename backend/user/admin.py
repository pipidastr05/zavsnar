from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'phone_number',
        'first_name',
        'last_name',
        'father_name',
        'email',
    )
    search_fields = ('last_name',)


admin.site.register(User, UserAdmin)
