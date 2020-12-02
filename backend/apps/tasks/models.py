from django.db import models

from django.contrib.auth import get_user_model

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    posted_by = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)


class Like(models.Model):
    user = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
    task = models.ForeignKey(
        'tasks.Task', related_name='likes', on_delete=models.CASCADE)
