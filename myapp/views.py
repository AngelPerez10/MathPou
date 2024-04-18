from django.http import HttpResponse
from .models import Project, Task
from django.shortcuts import render, redirect, get_object_or_404 ,HttpResponse,HttpResponsePermanentRedirect
from .forms import CreateNewTask, CreateNewProject
import json.encoder
import plotly as p
import plotly.express as px
import plotly.graph_objects as go
from django.shortcuts import render
from django.http import JsonResponse
#from .firebase_auth import register_user




import numpy as np
# Create your views here.
def index(request):
    return render(request, 'home.html', {
    })

def registro(request):

    return render(request, 'registro.htm',{

})

def prueba(request):
    return render(request, 'prueba.html', {
    })
def login(request):
    return render(request, 'login.html', {
    })

def obtener(request):
    # Obtener los parámetros de la solicitud GET
    amplitud_str1 = request.GET.get('amplitud1', '')
    tiempo_str1 = request.GET.get('tiempo1', '')
    
    amplitud_str2 = request.GET.get('amplitud2', '')
    tiempo_str2 = request.GET.get('tiempo2', '')

    amplitud_str3 = request.GET.get('amplitud3', '')
    tiempo_str3 = request.GET.get('tiempo3', '')

    armoniaco_str = request.GET.get('armoniaco', '')

    # Convertir la amplitud y el tiempo a números flotantes
    a1 = float(amplitud_str1)
    t1 = float(tiempo_str1)
    
    a2 = float(amplitud_str2)
    t2 = float(tiempo_str2)

    a3 = float(amplitud_str3)
    t3 = float(tiempo_str3)

    armoniaco = int(armoniaco_str)
    tiemp = t2  # T
    w0 = (2 * np.pi) / tiemp
    a0 = (2 / tiemp) * ((a1 - a2) * t1 + a2 * t2)

    f = a0 / 2
    tiempo = np.arange(0, 3 * tiemp, tiemp / (2048 * np.pi))
    
    for n in range(1, armoniaco + 1):
        an = (1 / (n * np.pi)) * ((a1 - a2) * np.sin(2 * n * np.pi * t1 / t2))
        bn = -(1 / (n * np.pi)) * ((a1 - a2) * np.cos(2 * n * np.pi * t1 / t2) + a2 - a1)
        Am = np.sqrt(an ** 2 + bn ** 2)  # Magnitud de An
        phi = -np.arctan2(bn, an)  # Fase de phi n
        f += an * np.cos(n * w0 * tiempo) + bn * np.sin(n * w0 * tiempo)

    # Generar la señal cuadrada a través de la Serie de Fourier
    signal = f  # Ajustar según sea necesario
  
    # Crear el gráfico con Plotly
    fig = px.line(x=tiempo, y=signal, labels={'x': 'Tiempo', 'y': 'Amplitud'})
    fig.update_layout(title='Aproximación de la Señal Cuadrada mediante Serie de Fourier')
    # Convertir la figura de Plotly a JSON
    graph_json = json.dumps(fig, cls=p.utils.PlotlyJSONEncoder)

    datos = {
        'graph_json': graph_json,
        'amplitud': amplitud_str1,
        'tiempo': tiempo_str1
    }

    return render(request, 'grafica.html', datos)




def grafica(request):
    amplitud = 20
    tiempo = 1
    frequency = 10  # Ajusta esto según sea necesario
    t = np.linspace(0, 1, 1000)  # Vector de tiempo
    
    # Función para generar la señal cuadrada a través de la Serie de Fourier
    def fourier_signal(frequency, t, amplitud, tiempo):
        return sum((amplitud * 4 / (np.pi * (2 * n - 1))) * np.sin(2 * np.pi * (2 * n - 1) * frequency * t) for n in range(1, int(tiempo) + 1))
    
    # Crear la figura inicial con el primer valor de frecuencia y amplitud
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=t, y=fourier_signal(frequency, t, amplitud, tiempo), mode='lines', name=f'Frecuencia {frequency}, Amplitud {amplitud}'))
    
    # Crear y agregar los sliders para amplitud y frecuencia
    steps_amplitud = []
    for a in np.linspace(1, amplitud, amplitud):  # Rango de amplitud de 1 a 10
        step_amplitud = dict(
            method="update",

            label=str(a),
            args=[{"y": [fourier_signal(frequency, t, a, tiempo)]}],
        )
        steps_amplitud.append(step_amplitud)

    sliders_amplitud = [dict(

        y=0.05,
        active=0,
        currentvalue={"prefix": "Amplitud: "},
        pad={"t": 50},
        steps=steps_amplitud
    )]
    
    steps_frequency = []
    for f in np.linspace(1, frequency, frequency):  # Rango de frecuencia de 1 a 10
        step_frequency = dict(
            method="update",
            label=str(int(f)),
            args=[{"y": [fourier_signal(f, t, amplitud, tiempo)]}],
        )
        steps_frequency.append(step_frequency)

    sliders_frequency = [dict(
        y=0.3,
        active=0,
        currentvalue={"prefix": "Frecuencia: "},
        pad={"t": 50},
        steps=steps_frequency
    )]
    
    # Actualizar el diseño del gráfico con los sliders
    fig.update_layout(
        sliders=sliders_amplitud + sliders_frequency,  # Agregar ambos sliders
        title='Aproximación de la Señal Cuadrada mediante Serie de Fourier'
    )
    
    # Convertir la figura de Plotly a JSON
    graph_json = json.dumps(fig, cls=p.utils.PlotlyJSONEncoder)
    datos = {
        'graph_json': graph_json,
        'amplitud': amplitud,
        'tiempo': tiempo
    }

    return render(request, 'grafica.html', datos)



