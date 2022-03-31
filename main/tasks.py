import json
import os
import shutil

from celery.decorators import periodic_task
from celery.decorators import task
from celery.task.schedules import crontab
from django.conf import settings
from .models import FileUpload

from . import main_algo


@task(name="process file")
def process_file_upload(files_unique_key):
    file = FileUpload.objects.filter(unique_key=files_unique_key).first()
    try:
        if file.status != 'not started':
            return
        file.status = 'started'
        file.save()

        unique_key = file.unique_key
        file_path = os.path.join(settings.BASE_DIR, settings.MEDIA_REL_PATH, str(file.file))
        output_file_path = os.path.join(settings.BASE_DIR, settings.MEDIA_REL_PATH, 'user_' + unique_key)
        output_file = os.path.join(output_file_path, 'output.wav')

        if os.path.exists(output_file):
            os.remove(output_file)

        file.percentage_completed = 25
        file.save()

        # run main algo
        main_algo.convert_to_wav(file_path, output_file)
        file.percentage_completed = 50
        file.save()

        plain_text = main_algo.get_plain_text(output_file, folder_name=output_file_path)
        file.percentage_completed = 75
        file.save()

        subtitles = main_algo.get_subtitles(output_file, folder_name=output_file_path)

        file.percentage_completed = 100
        file.status = 'completed'
        file.plain_text = plain_text
        file.subtitle = subtitles
        file.save()

        # run remove files
        shutil.rmtree(output_file_path)
    except FileNotFoundError:
        file.status = 'failed'
        file.save()
        pass


@periodic_task(run_every=(crontab(minute='*/15')), name="delete_expired_uploads", ignore_result=True)
def delete_expired_uploads():
    print('inna')
    return
