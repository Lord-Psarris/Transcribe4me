from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .models import FileUpload
import os
import shutil
import json


def home(request):
    return render(request, 'build/index.html')


def redirect_upload(request):
    return redirect('/')


@csrf_exempt
def receive_files(request):
    if request.FILES:
        if not request.session.exists(request.session.session_key):
            request.session.create()

        session_key = request.session.session_key
        data = request.FILES['file']

        new_file = FileUpload(file=data, session_key=session_key)
        new_file.save()

        return JsonResponse({'data': session_key}, status=200)
    return JsonResponse({'data': None}, status=200)


@csrf_exempt
def check_file_status(request):
    post_data = request.body.decode("utf-8")
    if post_data:
        file = FileUpload.objects.filter(session_key=post_data).first()
        if file is not None:
            if file.completed:
                data = json.loads(file.data)
                print(data)
                return JsonResponse({'status': file.status, 'completed': True, 'data': data}, status=200)
            else:
                return JsonResponse({'status': file.status, 'completed': False}, status=200)
    return JsonResponse({'message': 'No data'}, status=200)
