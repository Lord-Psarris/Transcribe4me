from apscheduler.schedulers.background import BackgroundScheduler
from .models import FileUpload as fl
from django.conf import settings
from . import main_algo as mla
import os
import json
import shutil

scheduled = BackgroundScheduler()


@scheduled.scheduled_job('interval', minutes=2)
def run_scripts():
    print('its starrted')
    for i in fl.objects.all():
        try:
            if i.status == 'not started':
                i.status = 'pending'
                i.save()

                session_key = i.session_key
                file_path = os.path.join(settings.BASE_DIR, settings.MEDIA_REL_PATH, str(i.file))
                output_file_path = os.path.join(settings.BASE_DIR, settings.MEDIA_REL_PATH, 'user_' + session_key, 'output.wav')

                # run main algo
                mla.convert_to_wav(file_path, output_file_path)
                subtitles = mla.get_subtitles(output_file_path, folder_name=session_key)
                plain_text = mla.get_plain_text(output_file_path, folder_name=session_key)

                i.completed = True
                i.status = 'completed'
                i.data = json.dumps({'sub': subtitles, 'plain': plain_text})
                i.save()
                print('done')

                # run remove files
                # i.delete()
                shutil.rmtree(os.path.join(settings.BASE_DIR, settings.MEDIA_REL_PATH, 'user_' + session_key))
        except Exception as e:
            print(e)
            continue
