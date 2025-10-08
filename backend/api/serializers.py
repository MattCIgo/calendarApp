from rest_framework import serializers
from .models import User, UserNote

"""
user Model Serializers
"""

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'first_name', 'last_name', 'email', 'password')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Only Fields in POST request
        fields = ('first_name', 'last_name', 'email', 'password')

class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')


"""
User Note Model Serializers
"""
class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ('note_id', 'message', 'date_created', 'user_id')

class CreateUserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ('message')