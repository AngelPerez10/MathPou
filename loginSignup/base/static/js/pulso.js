let maxHarmonics = 11; // Número de armónicas
let amplitudes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Amplitudes iniciales para las 11 ondas
let lastAmplitudes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Almacena las últimas amplitudes
let bars = []; // Datos de las barras
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'gray', 'cyan', 'magenta']; // Colores para las 11 armónicas
let xValue = 400; // Valor de x que deseas utilizar

let individualCanvas; // Canvas para las ondas individuales
let sumCanvas; // Canvas para la suma de las ondas
let barCanvas; // Canvas para las barras

function setup() {
    // Crear los gráficos para las 11 ondas, la suma y las barras por separado
    individualCanvas = createGraphics(800, 300); // Reducir la altura a 300 píxeles (valor original)
    sumCanvas = createGraphics(800, 400); // Gráfico para la suma
    barCanvas = createGraphics(800, 150); // Gráfico para las barras

    let mainCanvas = createCanvas(800, 850); // Reducir la altura del canvas principal a 850 píxeles (valor original)
    mainCanvas.parent('canvas-container'); // Asignar el canvas al contenedor principal

    textSize(15);

    // Configuración inicial de las barras
    for (let i = 0; i < maxHarmonics; i++) {
        bars.push({
            x: i * 70 + 15, // Mantener el espaciado de 70 píxeles y desplazamiento de 15 píxeles
            y: 100, // Posición en y
            width: 40, // Ancho de la barra
            amplitude: amplitudes[i], // Amplitud
            dragging: false // Estado de arrastre
        });
    }
}

function draw() {
    background(255); // Fondo blanco para el canvas principal

    // Dibuja las gráficas en sus respectivos gráficos
    drawBars(); // Dibujar las barras de amplitud
    drawIndividualSignals(); // Dibujar las señales individuales
    drawSumSignal(); // Dibujar la suma de las señales

    // Mostrar los gráficos en el canvas principal
    image(barCanvas, 0, 0); // Mostrar las barras de amplitud
    image(individualCanvas, 0, 150); // Mostrar las señales individuales
    image(sumCanvas, 0, 450); // Ajustar la posición de la suma (valor original)
}

function drawBars() {
    barCanvas.background(255); // Fondo blanco para las barras
    barCanvas.strokeWeight(2);

    // Dibuja las barras
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        barCanvas.fill(colors[i]);
        barCanvas.rect(bar.x, bar.y, bar.width, -bar.amplitude * 50); // Escala de las barras

        // Mostrar la amplitud
        barCanvas.fill(0);
        barCanvas.text('A' + (i + 1) + ': ' + bar.amplitude.toFixed(4), bar.x, 20);
    }
}

function drawIndividualSignals() {
    individualCanvas.background(255); // Fondo blanco para las señales individuales
    individualCanvas.strokeWeight(2);

    // Dibuja las señales armónicas estáticas
    for (let i = 0; i < maxHarmonics; i++) {
        if (!bars[i].dragging) {
            drawSingleHarmonic(individualCanvas, i, 150, lastAmplitudes[i]); // Dibujar todas las ondas en yPos = 150
        }
    }

    // Dibuja las señales dinámicas (cuando se arrastran las barras)
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        if (bar.dragging) {
            drawSingleHarmonic(individualCanvas, i, 150, bar.amplitude); // Dibujar todas las ondas en yPos = 150
            lastAmplitudes[i] = bar.amplitude; // Actualizar la última amplitud conocida
        }
    }
}

function drawSumSignal() {
    sumCanvas.background(255); // Fondo blanco para la suma
    sumCanvas.strokeWeight(2);
    sumCanvas.beginShape();
    sumCanvas.stroke('blue');
    sumCanvas.noFill();

    for (let x = 0; x < width; x++) {
        let sumY = 0;
        for (let i = 0; i < maxHarmonics; i++) {
            let angle = TWO_PI * (i + 1) * (x / width) * 2; // Factor de 2 para el rango completo
            sumY += sin(angle) * lastAmplitudes[i] * 50; // Escala de la suma
        }
        let y = 200 + sumY; // Centrado para la suma
        sumCanvas.vertex(x, y);
    }
    sumCanvas.endShape();
}

function drawSingleHarmonic(canvas, index, yPos, amplitude) {
    canvas.beginShape();
    canvas.stroke(colors[index]);
    canvas.noFill();
    for (let x = 0; x < width; x++) {
        let angle = TWO_PI * (index + 1) * (x / width) * 2; // Factor de 2 para el rango completo
        let y = yPos + sin(angle) * amplitude * 30; // Reducir la escala de la amplitud a 30
        canvas.vertex(x, y);
    }
    canvas.endShape();
}

function mousePressed() {
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        if (mouseX > bar.x && mouseX < bar.x + bar.width && mouseY > bar.y - 150 && mouseY < bar.y + 150) {
            bar.dragging = true;
            return;
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < maxHarmonics; i++) {
        bars[i].dragging = false;
    }
}

function mouseDragged() {
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        if (bar.dragging) {
            bar.amplitude = constrain((100 - mouseY) / 100, -1, 1); // Ajustar el rango a [-1, 1]
            return;
        }
    }
}

document.getElementById('ejem1').addEventListener('click', function() {
    let newAmplitudes = [0.3, 0.4, 0.5, 0.6, -1, -0.2, 0.8, -0.7, 0.5, 0.2, -0.9]; // Valores para el ejemplo 1

    // Actualiza las amplitudes y las barras
    for (let i = 0; i < maxHarmonics; i++) {
        amplitudes[i] = newAmplitudes[i];
        bars[i].amplitude = newAmplitudes[i];
        lastAmplitudes[i] = newAmplitudes[i]; // También actualizamos las últimas amplitudes
    }

    // Redibuja las señales individuales y la suma
    drawBars();
    drawIndividualSignals();
    drawSumSignal();
});

document.getElementById('ejem2').addEventListener('click', function() {
    let newAmplitudes = [0.1, -0.4, 0.5, -0.6, -1, -0.2, 0.3, -0.8, 0.6, 0.4, 0.1]; // Valores para el ejemplo 2

    // Actualiza las amplitudes y las barras
    for (let i = 0; i < maxHarmonics; i++) {
        amplitudes[i] = newAmplitudes[i];
        bars[i].amplitude = newAmplitudes[i];
        lastAmplitudes[i] = newAmplitudes[i]; // También actualizamos las últimas amplitudes
    }

    // Redibuja las señales individuales y la suma
    drawBars();
    drawIndividualSignals();
    drawSumSignal();
});

document.getElementById('ejem3').addEventListener('click', function() {
    let newAmplitudes = [1, 0.4, 1, 0.6, -1, -0.2, 0.9, -0.5, 0.7, 0.3, -0.4]; // Valores para el ejemplo 3

    // Actualiza las amplitudes y las barras
    for (let i = 0; i < maxHarmonics; i++) {
        amplitudes[i] = newAmplitudes[i];
        bars[i].amplitude = newAmplitudes[i];
        lastAmplitudes[i] = newAmplitudes[i]; // También actualizamos las últimas amplitudes
    }

    // Redibuja las señales individuales y la suma
    drawBars();
    drawIndividualSignals();
    drawSumSignal();
});

document.getElementById('ejem4').addEventListener('click', function() {
    let newAmplitudes = [-1, 0.4, -0.5, 0.6, -1, -0.2, 0.8, -0.6, 0.4, -0.3, 0.2]; // Valores para el ejemplo 4

    // Actualiza las amplitudes y las barras
    for (let i = 0; i < maxHarmonics; i++) {
        amplitudes[i] = newAmplitudes[i];
        bars[i].amplitude = newAmplitudes[i];
        lastAmplitudes[i] = newAmplitudes[i]; // También actualizamos las últimas amplitudes
    }

    // Redibuja las señales individuales y la suma
    drawBars();
    drawIndividualSignals();
    drawSumSignal();
});