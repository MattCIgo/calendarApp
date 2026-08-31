from . import serializers, models
from datetime import timedelta
import json
from django.conf import settings
from django.core import serializers as djangoserializers
from django.contrib.auth import get_user_model, authenticate
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings


@api_view(['POST'])
# @authentication_classes([]) 
# @permission_classes([AllowAny])
def activate(request):
  token_str = request.data.get('token')
  print(token_str)

  try:
    token = AccountActivationToken(token_str)
    user_id = token['user_id']
    user = models.User.objects.get(user_id=user_id)

    user.is_active = True
    user.save()

    return Response({"message": "Account activated successfully!"}, status=status.HTTP_200_OK)
  except (models.User.DoesNotExist): 
    return Response({"error": "User doesn't Exist."}, status=status.HTTP_404_NOT_FOUND)
  except (TokenError, InvalidToken):
    return Response({"error": "Link Expired"}, status=status.HTTP_400_BAD_REQUEST)
    

# Get Account Activation Token
class AccountActivationToken(Token):
  token_type = "activation"
  lifetime = timedelta(days=1)

  @classmethod
  def for_user(cls, user):
    token = cls()
    token['user_id'] = user.user_id
    return token

# Get new Refresh Token 
class CustomTokenRefreshView(TokenRefreshView):
  def post(self, request, *list_args, **kwargs):
    refresh_token = request.COOKIES.get(settings.SIMPLE_JWT.get('REFRESH_COOKIE'))
    
    if not refresh_token:
      return Response({"error": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)
    
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
    serializer = serializers.CreateUserSerializer(data=request.data)
    
    try:
      if serializer.is_valid(raise_exception=True):
        user = serializer.save()

        self._activate_account(request, user, serializer.validated_data['email'])

        return Response({"message": "User Created! Activate your Account"}, status=status.HTTP_200_OK)
      
      else:
        return Response({"error": "Missing Information"}, status=status.HTTP_400_BAD_REQUEST)
    except (KeyError) as e:
      return Response({"error": "Missing Email"}, status=status.HTTP_400_BAD_REQUEST)

  def _activate_account(self, request, user, to_email):
    mail_subject = "Activate your Account."
    token = AccountActivationToken.for_user(user)
    frontend_url_activate = f"{settings.FRONTEND_URL}/activate/{str(token)}"
    message = render_to_string("activate_account.html", {
      'user': user.username,
      'react_frontend_url': frontend_url_activate,
      'Protocol': 'http'
    })

    email = EmailMessage(mail_subject, message, to={to_email})

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
    
    if serializer.is_valid():
      email = serializer.validated_data['email']
      password = serializer.validated_data['password']
    else:
      return Response({"error": "Invalid Username and Password"}, status=status.HTTP_400_BAD_REQUEST)

    try: 
      user = authenticate(request=request, username=email, password=password)

      if user:
        refresh = RefreshToken.for_user(user)
      else:
        return Response({"error": "Invalid Username or Password"}, status=status.HTTP_400_BAD_REQUEST)

      response = Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)

      lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

      response.set_cookie(
        key=settings.SIMPLE_JWT.get('REFRESH_COOKIE'),
        value=str(refresh),
        max_age=int(lifetime.total_seconds()),
        secure=settings.SIMPLE_JWT.get('COOKIE_SECURE'),
        httponly=settings.SIMPLE_JWT.get('COOKIE_HTTP_ONLY'),
        samesite=settings.SIMPLE_JWT.get('COOKIE_SAMESITE')
      )

      return response

    except Exception:  
      return Response({"error": "Invalid Username or Password"}, status=status.HTTP_400_BAD_REQUEST)

    

"""
  Logging out
"""
class UserLogout(APIView):
  def post(self, request, format=None):
    try:
      refresh = request.COOKIES.get('refresh_token')

      if not refresh:
        return Response({"error": "Refresh Token Required"}, status=status.HTTP_400_BAD_REQUEST)

      token = RefreshToken(refresh)
      token.blacklist()

      response = Response ({"message": "Successfully Logged Out"}, status=status.HTTP_200_OK)

      response.delete_cookie(
        key=setting.SIMPLE_JWT.get('REFRESH_COOKIE'),
        path='/',
        domain=None,
        samesite=settings.SIMPLE_JWT.get('COOKIE_SAMESITE')
      )

      return response

    except (TokenError, InvalidToken):
      return Response([{"error": "Invalid Token"}], status=status.HTTP_400_BAD_REQUEST)



class UserNoteView(APIView):
  """
    Creating a Note
  """
  authentication_classes = [JWTAuthentication]
  permission_classes = [IsAuthenticated]

  def post(self, request, format=None):
    serializer = serializers.CreateUserNoteSerializer(data=request.data)

    try:
      if serializer.is_valid():
        if (serializer.validated_data['method'] == "createNote"):
          message = serializer.validated_data['message']
          date = serializer.validated_data['date']
          user_id = models.User.objects.get(user_id=request.user.user_id)

          new_note = models.UserNote(message=message, user_id=user_id, date = date)
          new_note.save()

          return_note = djangoserializers.serialize('json', [new_note,])

          return Response([{"message": "Created Note", "return_note": return_note}], status=status.HTTP_200_OK)

        elif (serializer.validated_data['method'] == "deleteNote"):
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

      data = json.loads(djangoserializers.serialize('json', user_notes))

      return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
      return Response([{"error": "User not logged In or doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

  """
    Search for Specific Notes
  """
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

      data = djangoserializers.serialize('json', user_notes)
      print(user_notes)

      return Response(data, status=status.HTTP_200_OK)

    except:
      return Response([{"error": "User not logged In or doesn't exist"}], status=status.HTTP_400_BAD_REQUEST)

        