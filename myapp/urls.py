from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('grafica/', views.grafica, name="grafica_index"), #grafica es para el apartado de grafica ejemplo
    path('grafica/obtener', views.obtener, name="grafica"),#vista de grafica donde el usuario manda los valores 
    path('login/',views.login, name='login'),#te mandara al login 
    path('prueba/',views.prueba, name='prueba'),

]