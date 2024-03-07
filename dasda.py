import wx
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_wxagg import FigureCanvasWxAgg as FigureCanvas

class FourierTransformApp(wx.Frame):
    def __init__(self, parent, title):
        super(FourierTransformApp, self).__init__(parent, title=title, size=(800, 600))

        self.panel = wx.Panel(self)
        self.figure = plt.Figure()
        self.axes = self.figure.add_subplot(111)
        self.canvas = FigureCanvas(self.panel, -1, self.figure)

        # Slider for frequency
        self.frequency_slider = wx.Slider(self.panel, value=10, minValue=1, maxValue=100, style=wx.SL_HORIZONTAL)
        self.frequency_text = wx.StaticText(self.panel, label="Frecuencia fundamental")
        self.Bind(wx.EVT_SLIDER, self.on_slider_change, self.frequency_slider)

        # Generate signal button
        self.generate_button = wx.Button(self.panel, label="Generar Señal Cuadrada")
        self.Bind(wx.EVT_BUTTON, self.on_generate_signal, self.generate_button)

        # Layout
        self.sizer = wx.BoxSizer(wx.VERTICAL)
        self.sizer.Add(self.canvas, 1, wx.EXPAND)
        self.sizer.Add(self.frequency_text, 0, wx.EXPAND | wx.ALL, 5)
        self.sizer.Add(self.frequency_slider, 0, wx.EXPAND | wx.ALL, 5)
        self.sizer.Add(self.generate_button, 0, wx.EXPAND | wx.ALL, 5)

        self.panel.SetSizer(self.sizer)
        self.Fit()

    def on_slider_change(self, event):
        frequency = self.frequency_slider.GetValue()
        self.frequency_text.SetLabel(f"Frecuencia fundamental: {frequency}")

    def on_generate_signal(self, event):
        frequency = self.frequency_slider.GetValue()
        t = np.linspace(0, 1, 1000)  # Time vector
        self.signal = np.zeros_like(t)  # Initialize the signal

        # Número de términos en la serie de Fourier
        num_terms = 25  # Puedes ajustar este para cambiar la precisión de la aproximación

        # Construir la señal cuadrada usando la serie de Fourier
        for n in range(1, num_terms + 1):
            harmonic = 2 * n - 1  # Solo usamos armónicos impares
            self.signal += (4 / (np.pi * harmonic)) * np.sin(2 * np.pi * harmonic * frequency * t)

        self.axes.clear()
        self.axes.plot(t, self.signal, label="Señal Cuadrada (Fourier)")
        self.axes.set_xlabel('Tiempo (s)')
        self.axes.set_ylabel('Amplitud')
        self.axes.set_title('Aproximación de la Señal Cuadrada mediante Serie de Fourier')
        self.axes.grid(True)
        self.axes.legend()
        self.canvas.draw()

if __name__ == '__main__':
    app = wx.App(False)
    frame = FourierTransformApp(None, "Aproximación Fourier de Señal Cuadrada")
    frame.Show()
    app.MainLoop()
