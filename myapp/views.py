from django.http import HttpResponse
from .models import Project, Task
from django.shortcuts import render, redirect, get_object_or_404
from .forms import CreateNewTask, CreateNewProject
import json.encoder
import plotly as p
import plotly.express as px


import numpy as np

# Create your views here.


def index(request):
    title = 'Django Course!!'
    return render(request, 'index.html', {
        'title': title
    })

def obtener(request, amplietud, tiempo):
    # Convertir amplietud y tiempo a números flotantes
    amplietud = float(amplietud)
    tiempo = float(tiempo)

    frequency = 10  # Ajusta esto según sea necesario
    t = np.linspace(0, 1, 1000)  # Vector de tiempo
    
    # Generación de la señal cuadrada a través de la Serie de Fourier
    signal = sum((amplietud * 4 / (np.pi * (2 * n - 1))) * np.sin(2 * np.pi * (2 * n - 1) * frequency * t) for n in range(1, int(tiempo) + 1))

    # Crear el gráfico con Plotly
    fig = px.line(x=t, y=signal, labels={'x': 'Tiempo', 'y': 'Amplitud'})
    fig.update_layout(title='Aproximación de la Señal Cuadrada mediante Serie de Fourier')

    # Convertir la figura de Plotly a JSON
    graph_json = json.dumps(fig, cls=px.utils.PlotlyJSONEncoder)

    return render(request, 'grafica.html', {'graph_json': graph_json})


def grafica(request):
    
    frequency = 10  # Ajusta esto según sea necesario
    t = np.linspace(0, 1, 1000)  # Vector de tiempo
    # Generación de la señal cuadrada a través de la Serie de Fourier
    signal = sum((4 / (np.pi * (2 * n - 1))) * np.sin(2 * np.pi * (2 * n - 1) * frequency * t) for n in range(1, 26))

    # Crear el gráfico con Plotly
    fig = px.line(x=t, y=signal, labels={'x': 'Tiempo', 'y': 'Amplitud'})
    fig.update_layout(title='Aproximación de la Señal Cuadrada mediante Serie de Fourier')

    # Convertir la figura de Plotly a JSON
    graph_json = json.dumps(fig, cls=p.utils.PlotlyJSONEncoder)


    return render(request, 'grafica.html', {'graph_json': graph_json})

def hello(request, username):
    return HttpResponse("<h2>Hello %s</h2>" % username)


def projects(request):
    # projects = list(Project.objects.values())
    projects = Project.objects.all()
    return render(request, 'projects/projects.html', {
        'projects': projects
    })


def tasks(request):
    # task = Task.objects.get(title=tile)
    tasks = Task.objects.all()
    return render(request, 'tasks/tasks.html', {
        'tasks': tasks
    })


def create_task(request):
    if request.method == 'GET':
        return render(request, 'tasks/create_task.html', {
            'form': CreateNewTask()
        })
    else:
        Task.objects.create(
            title=request.POST['title'], description=request.POST['description'], project_id=2)
        return redirect('tasks')


def create_project(request):
    if request.method == 'GET':
        return render(request, 'projects/create_project.html', {
            'form': CreateNewProject()
        })
    else:
        Project.objects.create(name=request.POST["name"])
        return redirect('projects')

def project_detail(request, id):
    project = get_object_or_404(Project, id=id)
    tasks = Task.objects.filter(project_id=id)
    return render(request, 'projects/detail.html', {
        'project': project,
        'tasks': tasks
    })