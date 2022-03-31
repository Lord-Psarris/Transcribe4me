web: waitress-serve transcriber.wsgi:application
celery: celery -A transcriber worker --pool=solo -l info