from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
  path('users', views.UserCreate.as_view(), name="user-create"),
  path('login', views.UserLogin.as_view(), name="user-login"),
  path('logout', views.UserLogout.as_view(), name="user-logout"),
  path('notes', views.UserNoteView.as_view(), name="user-notes"),
  path('activate', views.activate , name="activate"),
  path('tokenrefresh', views.CustomTokenRefreshView.as_view(), name='token_refresh')
]