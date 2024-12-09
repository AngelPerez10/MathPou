from django.urls import path, include
from .views import authView, home, index, signal_data_view, show_signal_data_view, prueba_data, prueba_grafica, calculate_signal_of_prueba_grafica, grafica_example
from django.contrib.auth import views as auth_views

app_name = 'base'

urlpatterns = [
    path("", home, name="home"),  
    path("signup/", authView, name="authView"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("index/", index, name="index"),
    path('signal-data/', signal_data_view, name='signal-data'),
    path('grafica/', show_signal_data_view, name='show-signal-data'),
    path('prueba-tabla/', prueba_data, name='prueba-data'),
    path('prueba-grafica/', prueba_grafica, name='prueba-grafica'),
    path('calculate_signal_of_prueba_grafica/', calculate_signal_of_prueba_grafica, name='calculate_signal_of_prueba_grafica'),
    path('grafica_example/<str:graph_id>/', grafica_example, name='grafica_example'),
]
