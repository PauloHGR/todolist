from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views


urlpatterns = [
    path('tasks/', views.task_list, name='task-list'),
    path('tasks/<int:pk>/', views.task_detail, name='task-detail'),
]
