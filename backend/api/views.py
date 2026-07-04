from django.shortcuts import render
from django.core import serializers as djangoserializers
from django.utils import timezone
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from datetime import datetime
from . import serializers, models
from .tokens import account_activation_token
import random, json

# TODO: more descriptive errors

def activate(request, uidb64, token):
  #TODO: activate accound in database, then make frontend redirect to homepage.
  return print("In activate function")

"""
  Create User
"""
class UserCreate(APIView):
  def post(self, request, format=None):
    # TODO: Check for user alread yexists serial,izer error ******
    serializer = serializers.UserSerializer(data=request.data)
    
    try:
      serializer.is_valid()
      first_name = serializer.validated_data['first_name']
      last_name = serializer.validated_data['last_name']
      password = serializer.validated_data['password']
      email = serializer.validated_data['email']

      user = models.User.objects.create(first_name=first_name, last_name=last_name, email=email, password=password)
      UserCreate.activateAccount(request, user, email)

      return Response({"message": "User Created! Activate your Account"}, status=status.HTTP_200_OK)

    except Exception as e:
      print(e)
      return Response({"error": "User Already Exists"}, status=status.HTTP_400_BAD_REQUEST)

  def activateAccount(request, user, to_email):
    mail_subject = "Activate your Account."
    message = render_to_string("activate_account.html", {
      # TODO: get correct imports
      'user': user.username,
      'domain': get_current_site(request).domain,
      'uid': urlsafe_base64_encode(force_bytes(user.user_id)),
      'token': account_activation_token.make_token(user),
      'Protocol': 'http'
    })

    email = EmailMessage(mail_subject, message, to={to_email})

    # TODO: Change this to correct error handling
    if email.send():
      print("SUCCESS")
    else:
      print("FAIL")


"""
  Logging in
"""
class UserLogin(APIView):
  def post(self, request, format=None):
    serializer = serializers.LoginUserSerializer(data=request.data)
    
    serializer.is_valid()
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    user = models.User.objects.filter(email=email, password=password)
    if user.exists():
      uid = models.User.objects.get(email=email, password=password).user_id

    if not user.exists():  
      return Response([{"error": "User doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)
    elif user.exists() and Token.objects.filter(user_id=uid):
      return Response([{"token": Token.objects.get(user_id=uid).key}], status=status.HTTP_200_OK)

    user_token = Token.objects.create(user=user[0])

    return Response([{"token": user_token.key}], status=status.HTTP_200_OK)


"""
  Logging out
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
  Creating a Note
"""
class UserNoteView(APIView):
  """ 
   Creating a note 
  """
  def post(self, request, format=None):
    serializer = serializers.CreateUserNoteSerializer(data=request.data)

    try:
      serializer.is_valid()
      print(serializer.errors)
      print(serializer.validated_data['method'])

      if (serializer.validated_data['method'] == "createNote"):
        message = serializer.validated_data['message']
        date = serializer.validated_data['date']
        user_id = models.User.objects.get(user_id=request.user.user_id)

        new_note = models.UserNote(message=message, user_id=user_id, date = date)
        new_note.save()

        return_note = djangoserializers.serialize('json', [new_note,])

        return Response([{"message": "Created Note", "return_note": return_note}], status=status.HTTP_200_OK)

      elif (serializer.validated_data['method'] == "deleteNote"):
        print(serializer.validated_data['note_id'])
        user_id = models.User.objects.get(user_id=request.user.user_id)
        note_id = serializer.validated_data['note_id']

        note = models.UserNote.objects.get(note_id = note_id, user_id=user_id)
        note.delete()

        return Response({"message": "Deleted Note"}, status=status.HTTP_200_OK)

      else: 
        raise Exception("invalid method")           

    except Exception as e:
      print(e)
      return Response({"error": "Unable to Create Note/Field Can't be blank. (get better errors)"}, status=status.HTTP_400_BAD_REQUEST)


  """ 
    Receiving Notes 
  """
  def get(self, request, format=None):
    if 'keyWords' in request.GET:
      return self.search_notes(request)
    else:
      return self.retrieve_all_notes(request)

  def retrieve_all_notes(self, request):
    try:
      if request.user:
        user_notes = models.UserNote.objects.filter(user_id=request.user.user_id)

      # TODO: better way to serialize??? custom ?
      data = djangoserializers.serialize('json', user_notes)

      return Response(data, status=status.HTTP_200_OK)

    except:
      return Response([{"error": "User not logged In or doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

  def search_notes(self, request):
    try:
      key_words = request.GET.get('keyWords', '')
      start_date = request.GET.get('startDate', '')
      end_date = request.GET.get('endDate', '')
      order = request.GET.get('order', '')

      if order == "Oldest":
        order = "date"
      elif order == "Latest":
        order = "-date"

      if request.user:
        print('hello')
        queryset = models.UserNote.objects.filter(user_id=request.user.user_id, date__range=[start_date, end_date], message__contains = key_words)
        user_notes = queryset.order_by(order)

      # TODO: better way to serialize??? custom ?
      data = djangoserializers.serialize('json', user_notes)
      print(user_notes)

      return Response(data, status=status.HTTP_200_OK)

    except:
      return Response([{"error": "User not logged In or doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

        