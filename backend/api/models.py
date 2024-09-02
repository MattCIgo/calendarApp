from django.db import models
import random


def generate_user_id():
    while True:
        user_id = random.randint(000000000, 999999999)
        if User.objects.filter(user_id=user_id).count() == 0:
            break

    return user_id


class User(models.Model):
    user_id = models.IntegerField(primary_key=True, default=generate_user_id)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'
