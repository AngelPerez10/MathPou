from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponseBadRequest
import numpy as np
import json
from .forms import SignUpForm, LoginForm

def home(request):
    return render(request, "home.html", {})

@login_required
def index(request):
    return render(request, "index.html", {})

def authView(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Autenticar al usuario después del registro
            return redirect("base:index")  # Redirigir al index después de registrarse
    else:
        form = SignUpForm()
    return render(request, "registration/signup.html", {"form": form})

def custom_login(request):
    if request.method == "POST":
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("base:index")
    else:
        form = LoginForm()
    return render(request, "registration/login.html", {"form": form})

def custom_logout(request):
    logout(request)
    return redirect("base:home")

def signal_data_view(request):
    data = calculate_signal_data()
    return JsonResponse(data)

def show_signal_data_view(request):
    return render(request, 'grafica_view.html')

def prueba_data(request):
    return render(request, "prueba_data.html", {})

def prueba_grafica(request):
    return render(request, "prueba_grafica.html", {})

def grafica_example(request, graph_id):
    # Define diferentes conjuntos de datos según el `graph_id`
    if graph_id == '1':
        amplitudes = [0, 1, -2, 10]
        times = [0, 1, 3, 6]
    elif graph_id == '2':
        amplitudes = [0, 2, -3, 5]
        times = [0, 2, 4, 7]
    elif graph_id == '3':
        amplitudes = [0, 1, -1, 4]
        times = [0, 1.5, 3, 5]
    elif graph_id == '4':
        amplitudes = [0, 3, -2, 8]
        times = [0, 1, 2.5, 6]
    else:
        return HttpResponseBadRequest('Invalid graph ID')

    data = grafica_example_calculate(amplitudes, times)
    return JsonResponse(data)

def grafica_example_calculate(amplitudes, times):
    npulses = len(amplitudes) - 1
    T = times[npulses]
    w0 = 2 * np.pi / T
    a0 = 0

    for k in range(1, npulses + 1):
        a0 += (2 / T) * amplitudes[k] * (times[k] - times[k-1])

    f = a0 / 2
    t = np.linspace(0, 2 * T, 1024 * 2 * int(np.pi))

    an_values = []
    bn_values = []
    for n in range(1, 101):
        an, bn = 0, 0
        for k in range(1, npulses + 1):
            an += (1 / (n * np.pi)) * amplitudes[k] * (np.sin(n * w0 * times[k]) - np.sin(n * w0 * times[k-1]))
            bn -= (1 / (n * np.pi)) * amplitudes[k] * (np.cos(n * w0 * times[k]) - np.cos(n * w0 * times[k-1]))
        an_values.append(an)
        bn_values.append(bn)
        f += an * np.cos(n * w0 * t) + bn * np.sin(n * w0 * t)

    return {
        'amplitudes': an_values,
        'phases': bn_values,
        'time': list(t),
        'signal': list(f)
    }

def calculate_signal_data(matriz=None):
    if matriz is None:
        matriz = [[0, 0], [1, 1], [-2, 3], [10, 6]]  # Datos por defecto
    
    A = [row[0] for row in matriz]  # Amplitudes
    at = [row[1] for row in matriz]  # Tiempos
    npulses = len(A) - 1
    
    T = at[npulses]
    w0 = 2 * np.pi / T

    a0 = 0
    for k in range(1, npulses + 1):
        a0 += (2 / T) * A[k] * (at[k] - at[k-1])

    f = a0 / 2
    t = np.linspace(0, 2 * T, 1024 * 2 * int(np.pi))

    an_values = []
    bn_values = []
    for n in range(1, 101):
        an, bn = 0, 0
        for k in range(1, npulses + 1):
            an += (1 / (n * np.pi)) * A[k] * (np.sin(n * w0 * at[k]) - np.sin(n * w0 * at[k-1]))
            bn -= (1 / (n * np.pi)) * A[k] * (np.cos(n * w0 * at[k]) - np.cos(n * w0 * at[k-1]))
        an_values.append(an)
        bn_values.append(bn)
        f += an * np.cos(n * w0 * t) + bn * np.sin(n * w0 * t)

    return {
        'amplitudes': an_values,
        'phases': bn_values,
        'time': list(t),
        'signal': list(f),
        'T': T,
        'w0': w0
    }

def calculate_signal_of_prueba_grafica(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            matriz = data.get('datos', [])
            
            if not isinstance(matriz, list) or not all(isinstance(row, list) and len(row) == 2 for row in matriz):
                return HttpResponseBadRequest("Datos de entrada no válidos.")
            
            matriz = [[float(value) for value in row] for row in matriz]
            result = calculate_signal_data(matriz)
            return JsonResponse(result)

        except json.JSONDecodeError:
            return HttpResponseBadRequest("Error al procesar JSON.")
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return HttpResponseBadRequest("Método no permitido. Use POST.")