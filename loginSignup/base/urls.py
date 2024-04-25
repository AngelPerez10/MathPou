from django.urls import path, include
from .views import authView, home

urlpatterns = [
 path("", home, name="home"),
 path("login/", authView, name="login"),
 path("signup/", authView, name="authView"),
 path("accounts/", include("django.contrib.auth.urls")),
]
