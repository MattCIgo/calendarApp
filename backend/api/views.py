from django.shortcuts import render
from django.conf import settings
from django.core import serializers as djangoserializers
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from datetime import datetime
from . import serializers, models
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenRefreshView
import random, json

# TODO: more descriptive errors
# TODO: cleanup imports
# TODO: best way to use multiple get methods in a single view? or explicit url mapping?

# TODO: Runs twice? gets both account activated and link invalid (probably frontend problem (UseEffect?))
# TODO: cleanup errors and other stuff
# TODO: serializer for this????
@api_view(['POST'])
def activate(request):
  uid = request.data.get('uidb64')
  token = request.data.get('token')
  user = get_user_model()

  try:
    uid = force_str(urlsafe_base64_decode(uid))
    user = models.User.objects.get(user_id=uid)
  except: 
    user = None
  
  if user is not None and account_activation_token.check_token(user, token):
    user.is_active = True
    user.save()

    return Response({"message": "Account Activated"}, status=status.HTTP_200_OK)
  else:
    return Response({"error": "Link Invalid or Account already activated"}, status=status.HTTP_400_BAD_REQUEST)

  return Response({"error": "Something went wrong!"}, status=status.HTTP_400_BAD_REQUEST)


# TODO: Custom TokenRefreshView that handles refresh token in cookies
class CustomTokenRefreshView(TokenRefreshView):
  def post(self, request, *list_args, **kwargs):
    refresh_token = request.COOKIES.get('refresh_token')
    
    if not refresh_token:
      print("in refresh token not")
      return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)
    
    request.data['refresh'] = refresh_token
    
    try:
      response = super().post(request, *list_args, **kwargs)
        
      if response.status_code == 200:
        new_refresh = response.data.get('refresh')
        if new_refresh:
          lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

          response.set_cookie(
            key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
            value=str(new_refresh),
            max_age=int(lifetime.total_seconds()),
            secure=settings.SIMPLE_JWT['COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['COOKIE_SAMESITE']
          )
          
          del response.data['refresh'] 
      return response
        
    except Exception as e:
      return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)


"""
  Create User
"""
class UserCreate(APIView):
  def post(self, request, format=None):
    # TODO: Check for user already exists serializer error ******
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
      'user': user.username,
      'react_frontend_url': f"{settings.FRONTEND_URL}/activate/{urlsafe_base64_encode(force_bytes(user.user_id))}/{account_activation_token.make_token(user)}",
      'Protocol': 'http'
    })

    email = EmailMessage(mail_subject, message, to={to_email})

    # TODO: Change this to correct error handling
    if email.send():   
      print("Successfully sent email")
    else:
      print("Failed to sent email")


"""
  Logging in
"""
class UserLogin(APIView):
  def post(self, request, format=None):
    serializer = serializers.LoginUserSerializer(data=request.data)
    
    serializer.is_valid()
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    try: 
      user = models.User.objects.get(email=email, password=password)

      refresh = RefreshToken.for_user(user)

      response = Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)

      lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

      response.set_cookie(
        key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
        value=str(refresh),
        max_age=int(lifetime.total_seconds()),
        secure=settings.SIMPLE_JWT['COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['COOKIE_SAMESITE']
      )

      return response

    except Exception as e:  
      return Response({"error": "User doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

    

"""
  Logging out
"""
class UserLogout(APIView):
  def post(self, request, format=None):
    try:
      refresh = request.data.get("refresh")

      if not refresh:
        return Response({"error": "Refresh Token Required"}, status=status.HTTP_400_BAD_REQUEST)

      token = RefreshToken(refresh)
      token.blacklist()

      return Response([{"message": "Logged Out"}], status=status.HTTP_200_OK)

    except Exception as e:
      return Response([{"error": "Invalid Token"}], status=status.HTTP_400_BAD_REQUEST)



class UserNoteView(APIView):
  """
    Creating a Note
  """
  authentication_classes = [JWTAuthentication]
  permission_classes = [JWTAuthentication]

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
      data = json.loads(djangoserializers.serialize('json', user_notes))

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

        