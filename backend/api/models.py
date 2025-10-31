from django.db import models
from django.contrib.auth.models import UserManager, BaseUserManager, AbstractUser
from django.core.validators import MinLengthValidator
import datetime, random

#TODO: __str__ methods



#TODO: move to another file and make sure to check database for no duplicate id
def generate_random_user_id():
    return random.randint(100000000, 999999999) 




class User(AbstractUser):
    user_id = models.IntegerField(default=generate_random_user_id, primary_key=True)
    email = models.EmailField(null=False, unique=True, max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        managed = True
        db_table = 'user'  


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True  # Ensure superusers are active
        user.save(using=self._db)
        return user


class UserNote(models.Model):
    note_id = models.IntegerField(primary_key=True)
    message = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'user_note'

        