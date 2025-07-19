from django.urls import path
from .views import (
    home, index, authView, custom_login, custom_logout,
    signal_data_view, show_signal_data_view, prueba_data,
    prueba_grafica, calculate_signal_of_prueba_grafica, grafica_example
)

app_name = 'base'

urlpatterns = [
    path("", home, name="home"),
    path("index/", index, name="index"),
    path("signup/", authView, name="authView"),
    path("accounts/login/", custom_login, name="login"),
    path("accounts/logout/", custom_logout, name="logout"),
    path('signal-data/', signal_data_view, name='signal-data'),
    path('grafica/', show_signal_data_view, name='show-signal-data'),
    path('prueba-tabla/', prueba_data, name='prueba-data'),
    path('prueba-grafica/', prueba_grafica, name='prueba-grafica'),
    path('calculate_signal_of_prueba_grafica/', calculate_signal_of_prueba_grafica, name='calculate_signal_of_prueba_grafica'),
    path('grafica_example/<str:graph_id>/', grafica_example, name='grafica_example'),
]