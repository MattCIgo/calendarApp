from django.shortcuts import render
from django.core import serializers
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, CreateUserSerializer, CreateUserNoteSerializer, LoginUserSerializer
from .models import User, UserNote
from datetime import datetime
import random

#TODO: log user in on account creation?
#TODO: more specific error handling sent back for frontend user 
#TODO: handle user logout in all instances
#TODO: class based views


"""
    Create User
"""
class UserCreate(APIView):
    def post(self, request, format=None):
        serializer = CreateUserSerializer(data=request.data)
        
        try:
            serializer.is_valid()
            first_name = serializer.validated_data['first_name']
            last_name = serializer.validated_data['last_name']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']
            user = User(first_name=first_name, last_name=last_name, email=email, password=password)
            user.save()

            return Response({"message": "User Created!"}, status=status.HTTP_200_OK)

        except:
            return Response({"error": "User Already Exists"}, status=status.HTTP_400_BAD_REQUEST)


"""
    Logging in
"""
class UserLogin(APIView):
    def post(self, request, format=None):
        #TODO: User already logged in error
        serializer = LoginUserSerializer(data=request.data)
        
        #TODO: validated data not working, is_valid is false
        print(serializer.is_valid())
        print(serializer.errors)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        u = User.objects.filter(email=email, password=password)

        # TODO: better way to check (for 1), also send back token***
        if len(u) < 1:  
            return Response([{"error": "User doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

        # Generate Token for user (TODO: there is a better way to do this)
        user_token = Token.objects.create(user=u[0])

        return Response([{"token": user_token.key}], status=status.HTTP_200_OK)


"""
    Logging out
    #TODO: delete token on unexpected logout from user, incognito, etc...
"""
class UserLogout(APIView):
    def post(self, request, format=None):
        try:
            if request.user:
                request.user.auth_token.delete()
                
            return Response([{"message": "Logged Out"}], status=status.HTTP_200_OK)
    
        except Token.DoesNotExist:
            return Response([{"error": "Not Loggest Out"}], status=status.HTTP_400_BAD_REQUEST)


"""
    TODO: Creating a Note
"""
class UserNoteCRUD(APIView):
    """ Creating a note """
    def post(self, request, format=None):
        print(request.data)
        serializer = CreateUserNoteSerializer(data=request.data)

        try:
            #TODO: validated data not working, is_valid is false
            serializer.is_valid()

            message = serializer.validated_data['message']
            note_id = random.randint(111111111, 999999999)
            user_id = User.objects.get(user_id=request.user.user_id)

            new_note = UserNote(note_id=note_id, message=message, user_id=user_id)
            new_note.save()

            return Response({"message": "Created note"}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"error": "Unable to Create Note/Field Can't be blank. (get better errors)"}, status=status.HTTP_400_BAD_REQUEST)


    """ Receiving Notes 
    """
    def get(self, request, format=None):
        try:
            if request.user:
                user_notes = UserNote.objects.filter(user_id=request.user.user_id)

            return Response([{"message": "Notes Sent"}], status=status.HTTP_200_OK)

        except:
            return Response([{"error": "User not logged In or doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

        