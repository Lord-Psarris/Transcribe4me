from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('upload', views.redirect_upload),
    path('post-file/', views.receive_files),
    path('check-file/', views.check_file_status),
]