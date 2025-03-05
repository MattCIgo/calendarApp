from django.shortcuts import render
from .models import User
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializer, CreateUserSerializer
from rest_framework.views import APIView
import random


class UserCreate(APIView):
    # Creating serializer object
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        
        # TODO: how to get more specific error for is_valid?
        if serializer.is_valid():
            first_name = serializer.validated_data['first_name']
            last_name = serializer.validated_data['last_name']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']
            user_id = random.randint(111111111, 999999999)

            # TODO: check if generated used ID is already in use 

            user = User(user_id=user_id, first_name=first_name, last_name=last_name, email=email, password=password)
            user.save()

            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

        return Response("Enter Valid Input", status=status.HTTP_400_BAD_REQUEST)

    def get():
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # TODO: check if user exists, if so then log them in, send back token???





