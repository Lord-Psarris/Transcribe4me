web: gunicorn transcriber.wsgi
celery: celery -A transcriber worker --pool=solo -l info