from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import *

admin.site.unregister(User)  # Avoid "AlreadyRegistered" error
admin.site.register(User, UserAdmin)  # Register with Django's UserAdmin

admin.site.register(ChatGroup)
admin.site.register(GroupMessage)