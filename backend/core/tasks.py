from core.celery import app

@app.task
def test_celery_task():
    print("🎉 Celery task executed successfully!")
    return "Task Completed"
