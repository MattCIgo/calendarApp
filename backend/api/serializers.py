from rest_framework import serializers
from.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'first_name', 'last_name', 'email', 'password')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #Only Fields in POST request
        fields = ('first_name', 'last_name', 'email', 'password')