from django.contrib import admin
from django.urls import path
from main import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path("landing_page/", views.landing , name ='landing'),
]