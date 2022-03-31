import string
import random
from datetime import datetime

from django.db import models


def create_unique_id():
    length = 24
    small_letters = string.ascii_lowercase
    numbers = string.digits
    unique_id_list = small_letters + numbers

    while True:
        unique_key = ''.join(random.choices(unique_id_list, k=length))
        if FileUpload.objects.filter(unique_key=unique_key).count() == 0:
            break

    return unique_key


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<unique_key>/<filename>
    return 'user_{0}/{1}'.format(instance.unique_key, filename)


# Create your models here.
class FileUpload(models.Model):
    ip_address = models.CharField(max_length=64, default='')
    file = models.FileField(upload_to=user_directory_path)
    status = models.CharField(max_length=20, default='not started')
    percentage_completed = models.IntegerField(default=0)
    unique_key = models.CharField(max_length=255, default=create_unique_id)
    time_uploaded = models.DateTimeField(default=datetime.now)

    plain_text = models.TextField(default='')
    subtitle = models.TextField(default='')
