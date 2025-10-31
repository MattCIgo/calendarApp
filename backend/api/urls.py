from django.urls import path
from . import views

urlpatterns = [
    path('users', views.UserCreate.as_view(), name="user-create"),
    path('login', views.UserLogin.as_view(), name="user-login"),
    path('logout', views.UserLogout.as_view(), name="user-logout"),
    path('notes', views.UserNoteCRUD.as_view(), name="user-notes"),
]