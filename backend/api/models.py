from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser
import random

def generate_user_id():
        while True:
            user_id = random.randint(000000000, 999999999)
            if User.objects.filter(user_id=user_id).count() == 0:
                break

        return user_id


class User(AbstractBaseUser):
    user_id = models.IntegerField(primary_key=True, default=generate_user_id)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True, unique=True)
    password = models.CharField(max_length=50, blank=True, null=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    class Meta:
        managed = False  #Doesn't create or delete tables
        db_table = 'user'  
        
        
# TODO: relation 'User' does not exist, create table in poastgres first?

