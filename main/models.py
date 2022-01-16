from django.db import models


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<session_key>/<filename>
    return 'user_{0}/{1}'.format(instance.session_key, filename)


# Create your models here.
class FileUpload(models.Model):
    file = models.FileField(upload_to=user_directory_path)
    session_key = models.CharField(max_length=1024, blank=False, null=False)
    completed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='not started')
    moment_uploaded = models.DateTimeField(auto_now_add=True)
    data = models.CharField(max_length=10000, default='')
