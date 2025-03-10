from django.shortcuts import render
from django.core import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, CreateUserSerializer, LoginUserSerializer
from .models import User
import random


#TODO: validate token for every request****
#TODO: log user in on account creation


"""
    Create User
"""
class UserCreate(APIView):
    # TODO: login should be in post (new view??)
    def post(self, request, format=None):
        serializer_class = CreateUserSerializer
        serializer = serializer_class(data=request.data)

        print("Welcome to POST")
        
        # TODO: how to get more specific error for is_valid?
        if serializer.is_valid():
            print(serializer.validated_data)
            first_name = serializer.validated_data['first_name']
            last_name = serializer.validated_data['last_name']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']
            user_id = random.randint(111111111, 999999999)

            # TODO: check if generated used ID is already in use 

            user = User(user_id=user_id, first_name=first_name, last_name=last_name, email=email, password=password)
            user.save()

            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
    Logging in
"""
class UserLogin(APIView):
    def post(self, request, format=None):
        #TODO: User already logged in error
        serializer_class = LoginUserSerializer
        serializer = serializer_class(data=request.data)

        # TODO: Need validated data?
        email = serializer.initial_data['email']
        password = serializer.initial_data['password']

        u = User.objects.filter(email=email, password=password)

        # TODO: better way to check (for 1), also send back token***
        if len(u) < 1:  
            return Response([{"error": "User doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

        # Generate Token for user (TODO: there is a better way to do this)
        user_token = Token.objects.create(user=u[0])
        print(user_token)

        return Response([{"token": user_token.key}], status=status.HTTP_200_OK)

"""
    Logging out
"""
class UserLogout(APIView):
    def post(self, request, format=None):
        #TODO: delete token. Need any data sent? send token
        serializer_class = LoginUserSerializer
        serializer = serializer_class(data=request.data)

        user_token = serializer.initial_data['token']

        try:
            user_token = Token.objects.get(key=user_token)
            user_token.delete()

            return Response([{"message": "Logged out, token deleted"}], status=status.HTTP_200_OK)
        
        except Token.DoesNotExist:
            return Response([{"error": "no token deleted"}], status=status.HTTP_400_BAD_REQUEST)