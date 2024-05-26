from django.contrib import admin
from django.urls import path
from home import views
from .views import fetch_initial_message

urlpatterns = [
    path('', views.index, name='home'),
    path('about', views.about, name='about'),
    path('service', views.service, name='service'),
    path('localbot/welcome/', fetch_initial_message, name='fetch_initial_message'),
]
