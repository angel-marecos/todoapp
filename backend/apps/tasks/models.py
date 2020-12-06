from django.db import models

from django.contrib.auth import get_user_model

from django.utils import timezone

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    posted_by = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)


class Comment(models.Model):
    description = models.TextField(blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    comment_by = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True,
                               on_delete=models.CASCADE, blank=True)
    task = models.ForeignKey(
        'tasks.Task', related_name='comments', on_delete=models.CASCADE)


class Like(models.Model):
    user = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
    task = models.ForeignKey(
        'tasks.Task', related_name='likes', on_delete=models.CASCADE)
