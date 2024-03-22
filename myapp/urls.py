from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('grafica_index/', views.grafica, name="grafica_index"),
    path('grafica/obtener', views.obtener, name="grafica"),
    path('login/',views.login, name='login'),

]