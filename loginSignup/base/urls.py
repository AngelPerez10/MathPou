from django.urls import path, include
from .views import authView, home, index  # Asegúrate de importar la vista index

urlpatterns = [
    path("", home, name="home"),
    path("login/", authView, name="login"),
    path("signup/", authView, name="authView"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("index/", index, name="index"),  # Agrega la URL para index.html
]
