from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .models import FileUpload
import os
import shutil
import json
from . import tasks


def home(request):
    return render(request, 'build/index.html')


def redirect_to_upload(request):
    # redirects to homepage if user enters wrong url
    return redirect('/')


def check_if_has_file(request):
    # getting ip address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(',')[-1].strip()
    else:
        ip_address = request.META.get('REMOTE_ADDR')

    file_upload = FileUpload.objects.filter(ip_address=ip_address).first()
    if file_upload is not None:
        file_name = str(file_upload.file).split('/')[-1]
        return JsonResponse({'hasFile': True, 'uniqueId': file_upload.unique_key, 'file': file_name}, status=200)

    return JsonResponse({'hasFile': False}, status=200)


def receive_files(request):
    if request.FILES:
        # getting ip address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[-1].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR')

        # getting the file
        file = request.FILES['file']

        # add to db
        # check if file exists
        file_upload = FileUpload.objects.filter(ip_address=ip_address).first()
        if file_upload is not None:
            file_ = os.path.join(settings.BASE_DIR, settings.MEDIA_REL_PATH, str(file_upload.file))
            if os.path.exists(file_):
                os.remove(file_)
            file_upload.delete()

        new_file_uploaded = FileUpload(file=file, ip_address=ip_address)
        new_file_uploaded.save()

        tasks.process_file_upload.delay(new_file_uploaded.unique_key)

        return_data = {
            'uniqueId': new_file_uploaded.unique_key,
            'fileStatus': new_file_uploaded.status,
            'percentageComplete': new_file_uploaded.percentage_completed
        }

        return JsonResponse(return_data, status=200)
    return JsonResponse({'data': None}, status=200)


def check_file_progress(request, unique_key):
    file_upload = FileUpload.objects.filter(unique_key=unique_key).first()
    if file_upload is not None:
        if file_upload.status == 'completed':
            data = {
                'uniqueId': file_upload.unique_key,
                'fileStatus': file_upload.status,
                'percentageComplete': file_upload.percentage_completed,
                'plainText': file_upload.plain_text,
                'subtitle': file_upload.subtitle
            }
            return JsonResponse(data, status=200)

        data = {
            'uniqueId': file_upload.unique_key,
            'fileStatus': file_upload.status,
            'percentageComplete': file_upload.percentage_completed
        }
        return JsonResponse(data, status=200)
    return JsonResponse({'uniqueId': None}, status=200)
