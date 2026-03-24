from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserNote

"""
user Model Serializers
"""
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('first_name', 'last_name', 'email', 'password')


class CreateUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('user_id', 'first_name', 'last_name', 'email', 'password')


#TODO: more rigorous login validation, check if the correct datatype, whether in the database, etc...
class LoginUserSerializer(serializers.Serializer):
  email = serializers.EmailField(max_length=100)
  password = serializers.CharField(max_length=100, required=True)

  class Meta:
    model = User
    fields = ('email', 'password')


"""
User Note Model Serializers
"""
class UserNoteSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserNote
    fields = ('note_id', 'message', 'date_created', 'user_id', 'date')


# TODO: more extensive checks for validation?
class CreateUserNoteSerializer(serializers.ModelSerializer):
  message = serializers.CharField(max_length=2000, required=False)
  date = serializers.DateField(required=False)
  method = serializers.CharField(write_only=True, required=True)
  note_id = serializers.IntegerField(required=False)

  def validate(self, data):
    if data.get('method') == 'createNote':
      if not data.get('message'):
        raise serializers.ValidationError (
          {'message': 'message is required'}
        )
      elif not data.get('date'):
        raise serializers.ValidationError (
          {'date': 'date is required'}
        )

    elif data.get('method') == 'deleteNote':
      if not data.get('note_id'):
        raise serializers.ValidationError (
          {'note_id': 'note_id is required'}
        )

    return data

  class Meta:
    model = UserNote
    fields = ('message', 'date', 'method', 'note_id')
