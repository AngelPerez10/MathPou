from django.urls import path, include
from .views import authView, home, index
from django.contrib.auth import views as auth_views

app_name = 'base'  # Define the app namespace

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path("", home, name="home"),
    path("signup/", authView, name="authView"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("index/", index, name="index"),
]
