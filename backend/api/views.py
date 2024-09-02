from django.shortcuts import render
from .models import User
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializer, CreateUserSerializer
from rest_framework.views import APIView
import random

class UserCreate(APIView):
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            password = serializer.data.get('password')
            email = serializer.data.get('email')

            user = User(first_name=first_name, last_name=last_name, email=email, password=password)
            user.save()

            return Response(CreateUserSerializer(user).data, status=status.HTTP_200_OK)

        #TODO: change response
        return Response(status=status.HTTP_404_NOT_FOUND)

