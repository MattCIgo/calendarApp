from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser
from django.core.validators import MinLengthValidator

class User(AbstractBaseUser):
    user_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True, unique=True)
    password = models.CharField(max_length=50, blank=True, null=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    class Meta:
        managed = False  #Doesn't create or delete tables if False
        db_table = 'user'  
        

