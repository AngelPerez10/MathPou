'''Serie trigonometrica de Fourier con python'''
from __future__ import division
import numpy as np
import matplotlib.pyplot as plt

# Variables de control
T = 10
L = T / 2
rectangulos = 1000
x = np.linspace(-5, 5, 1000)


# Funcion de prueba
def f(x):
    return x*0+5


# coeficiente a
def a(n, L, rect):
    a, b = -L, L
    dx = (b - a) / rect
    integration = 0
    for x in np.linspace(a, b, rect):
        integration += f(x) * np.cos((n * np.pi * x) / L)
    integration *= dx
    return (1 / L) * integration


# coeficiente a
def b(n, L, rect):
    a, b = -L, L
    dx = (b - a) / rect
    integration = 0
    for x in np.linspace(a, b, rect):
        integration += f(x) * np.sin((n * np.pi * x) / L)
    integration *= dx
    return (1 / L) * integration


print('Coeficientes de Fourier con n=1')
print('a0 = ', a(0, L, rectangulos))
print ('an = ', a(1, L, rectangulos))
print('bn = ', b(1, L, rectangulos))


# Serie de Fourier Trigonometrica
def sFourier(x, L, muestra):
    a0 = a(0, L, rectangulos)
    sum = np.zeros(np.size(x))
    rng = np.arange(1, muestra + 1)
    for i in rng:
        sum += ((a(i, L, rectangulos) * np.cos((i * np.pi * x) / L)) +
                (b(i, L, rectangulos) * np.sin((i * np.pi * x) / L)))
    return (a0 / 2) + sum


# Funcion Original
plt.plot(x, f(x), linewidth=7, label='Funcion original')

# Serie de Fourier
plt.plot(x, sFourier(x, L, 100), '.',
         color='yellow', linewidth=.5, label='Serie de Fourier')

# Grafica de las funciones
plt.legend(loc='best')
plt.show()