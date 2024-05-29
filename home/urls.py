from django.contrib import admin
from django.urls import path
from home import views
from .views import fetch_initial_message,  process_message

urlpatterns = [
    path('', views.index, name='home'),
    path('localbot/welcome/', fetch_initial_message, name='fetch_initial_message'),
    path('localbot/prompt/', process_message, name='process_message'),
]
