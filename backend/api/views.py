from django.shortcuts import render
from django.core import serializers as djangoserializers
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from datetime import datetime
from . import serializers, models
import random, json

#TODO: log user in on account creation?
#TODO: more specific error handling sent back for frontend user 
#TODO: handle user logout in all instances


"""
    Create User
"""
class UserView(APIView):
    def post(self, request, format=None):
        serializer = serializers.CreateUserSerializer(data=request.data)
        
        try:
            serializer.is_valid()
            first_name = serializer.validated_data['first_name']
            last_name = serializer.validated_data['last_name']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']

            '''
            user_id = random.randint(100000000, 999999999)

            while models.User.objects.filter(user_id=user_id).exists():
                user_id = random.randint(100000000, 999999999)
            '''

            user = models.User(first_name=first_name, last_name=last_name, email=email, password=password)
            user.save()

            return Response({"message": "User Created!"}, status=status.HTTP_200_OK)

        except:
            return Response({"error": "User Already Exists"}, status=status.HTTP_400_BAD_REQUEST)


"""
    Logging in
"""
class UserLogin(APIView):
    def post(self, request, format=None):
        serializer = serializers.LoginUserSerializer(data=request.data)
        
        serializer.is_valid()
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        u = models.User.objects.filter(email=email, password=password)

        if not u.exists():  
            return Response([{"error": "User doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

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
            return Response([{"error": "Token Does not Exist"}], status=status.HTTP_400_BAD_REQUEST)


"""
    TODO: Creating a Note
"""
class UserNoteView(APIView):
    """ 
    Creating a note 
    """
    def post(self, request, format=None):
        serializer = serializers.CreateUserNoteSerializer(data=request.data)

        try:
            print(serializer.is_valid())  
            print(serializer.errors)
            message = serializer.validated_data['message']
            date = serializer.validated_data['date']
            user_id = models.User.objects.get(user_id=request.user.user_id)

            '''
            note_id = random.randint(100000000, 999999999)

            # If note_id already exists then generate another id
            while models.UserNote.objects.filter(note_id=note_id, user_id=user_id).exists():
                note_id = random.randint(100000000, 999999999)
            '''

            new_note = models.UserNote(message=message, user_id=user_id, date = date)
            new_note.save()

            return Response({"message": "Created note"}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"error": "Unable to Create Note/Field Can't be blank. (get better errors)"}, status=status.HTTP_400_BAD_REQUEST)


    """ 
    Receiving Notes 
    """
    def get(self, request, format=None):
        try:
            if request.user:
                user_notes = models.UserNote.objects.filter(user_id=request.user.user_id)

            print(user_notes)

            # TODO: better way to serialize???
            data = djangoserializers.serialize('json', user_notes)

            return Response(data, status=status.HTTP_200_OK)

        except:
            return Response([{"error": "User not logged In or doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

        