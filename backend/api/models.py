from django.db import models
from django.contrib.auth.models import UserManager, BaseUserManager, AbstractUser
from django.core.validators import MinLengthValidator
import datetime, random

#TODO: __str__ methods

#TODO: make user_id longer
"""
  User Model and related classes
"""
class User(AbstractUser):
  user_id = models.AutoField(primary_key=True)
  email = models.EmailField(null=False, unique=True, max_length=100)
  first_name = models.CharField(max_length=100)
  last_name = models.CharField(max_length=100)
  password = models.CharField(max_length=100)
  username = models.CharField(max_length=150, unique=True, null=True, blank=True)
  is_active = models.BooleanField(default=False)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['password',]

  objects = UserManager()

  class Meta:
    managed = True
    db_table = 'user'  


class UserManager(BaseUserManager):
  def create(self, email, password=None, **extra_fields):
    user = self.create(email, password, **extra_fields)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, password=None, **extra_fields):
    user = self.create(email, password, **extra_fields)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save(using=self._db)
    return user



"""
  UserNote Model and related classes
  #TODO: Probably need more descriptive destinctions between notes (note name, etc)
"""
class UserNote(models.Model):
  note_id = models.AutoField(primary_key=True)
  message = models.CharField(max_length=2000)
  date = models.DateField()
  date_created = models.DateTimeField(auto_now=True)
  user_id = models.ForeignKey(User, on_delete=models.CASCADE)

  class Meta:
    managed = True
    db_table = 'user_note'

        