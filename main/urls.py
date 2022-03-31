from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('upload', views.redirect_to_upload),

    path('upload-file/', views.receive_files),
    path('check-if-has-file/', views.check_if_has_file),
    path('check-file-progress/<str:unique_key>', views.check_file_progress),
]