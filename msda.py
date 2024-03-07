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

        self.frequency_slider = wx.Slider(self.panel, value=10, minValue=1, maxValue=100, style=wx.SL_HORIZONTAL)
        self.frequency_text = wx.StaticText(self.panel, label="Frecuencia de la señal: 10 Hz")
        self.Bind(wx.EVT_SLIDER, self.on_slider_change, self.frequency_slider)

        self.generate_button = wx.Button(self.panel, label="Generar Señal")
        self.Bind(wx.EVT_BUTTON, self.on_generate_signal, self.generate_button)

        self.sizer = wx.BoxSizer(wx.VERTICAL)
        self.sizer.Add(self.canvas, 1, wx.EXPAND)
        self.sizer.Add(self.frequency_text, 0, wx.EXPAND | wx.ALL, 5)
        self.sizer.Add(self.frequency_slider, 0, wx.EXPAND | wx.ALL, 5)
        self.sizer.Add(self.generate_button, 0, wx.EXPAND | wx.ALL, 5)

        self.panel.SetSizer(self.sizer)
        self.Fit()

        self.signal = None

        self.canvas.mpl_connect('button_press_event', self.on_mouse_down)
        self.canvas.mpl_connect('motion_notify_event', self.on_mouse_motion)
        self.canvas.mpl_connect('button_release_event', self.on_mouse_up)

        self.state = ''
        self.mouseInfo = None

    def on_slider_change(self, event):
        frequency = self.frequency_slider.GetValue()
        self.frequency_text.SetLabel(f"Frecuencia de la señal: {frequency} Hz")

    def on_generate_signal(self, event):
        frequency = self.frequency_slider.GetValue()
        t = np.linspace(0, 1, 1000)
        self.signal = np.where(np.sin(2 * np.pi * frequency * t) > 0, 1, 0)  # Señal cuadrada

        self.axes.clear()
        self.axes.plot(t, self.signal)
        self.axes.set_xlabel('Tiempo (s)')
        self.axes.set_ylabel('Amplitud')
        self.axes.grid(True)
        self.canvas.draw()

    def on_mouse_down(self, event):
        if self.state != '':
            return
        if self.axes.lines[0].contains(event)[0]:
            self.state = 'frequency'
        elif self.axes.lines[1].contains(event)[0]:
            self.state = 'time'
        else:
            self.state = ''
        self.mouseInfo = (event.xdata, event.ydata,
                          max(self.frequency_slider.GetValue(), .1),
                          max(self.signal))

    def on_mouse_motion(self, event):
        if self.state == '':
            return
        x, y = event.xdata, event.ydata
        if x is None:  # outside the axes
            return
        x0, y0, f0Init, AInit = self.mouseInfo
        if self.state == 'time':
            f0Init = 1. / f0Init
        self.frequency_slider.SetValue(int(f0Init + (f0Init * (x - x0) / x0)))
        self.on_generate_signal(None)

    def on_mouse_up(self, event):
        self.state = ''


if __name__ == '__main__':
    app = wx.App(False)
    frame = FourierTransformApp(None, "Transformada de Fourier - Señales Cuadradas")
    frame.Show()
    app.MainLoop()
