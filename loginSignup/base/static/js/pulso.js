let maxHarmonics = 11; // Ahora son 11 armónicas
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
    individualCanvas = createGraphics(800, 300); // Gráfico para las 11 ondas
    sumCanvas = createGraphics(800, 300); // Gráfico para la suma
    barCanvas = createGraphics(800, 150); // Gráfico para las barras

    let mainCanvas = createCanvas(800, 700); // Canvas principal con más altura
    mainCanvas.parent('canvas-container'); // Asignar el canvas al contenedor principal

    textSize(15);

    // Configuración inicial de las barras
    for (let i = 0; i < maxHarmonics; i++) {
        bars.push({
            x: i * 60 + 60, // Posición en x (se ajusta para caber en el canvas)
            y: 100, // Posición en y
            width: 40, // Ancho (ajustado para más barras)
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
    image(sumCanvas, 0, 450); // Mostrar la suma de las señales más abajo
}

function drawBars() {
    barCanvas.background(255); // Fondo blanco para las barras
    barCanvas.strokeWeight(2);

    // Dibuja las barras
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        barCanvas.fill(colors[i]);
        barCanvas.rect(bar.x, bar.y, bar.width, -bar.amplitude * 50); // Reducir la escala de las barras

        // Mostrar la amplitud
        barCanvas.fill(0);
        barCanvas.text('A' + (i + 1) + ': ' + bar.amplitude.toFixed(2), bar.x, 20);
    }
}

function drawIndividualSignals() {
    individualCanvas.background(255); // Fondo blanco para las señales individuales
    individualCanvas.strokeWeight(2);

    // Dibuja las señales armónicas
    for (let i = 0; i < maxHarmonics; i++) {
        if (!bars[i].dragging) {
            drawSingleHarmonic(individualCanvas, i, 150, lastAmplitudes[i]); // Dibujar la armónica estática
        }
    }

    // Dibuja las señales dinámicas
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        if (bar.dragging) {
            drawSingleHarmonic(individualCanvas, i, 150, bar.amplitude); // Dibujar la armónica en movimiento
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
            sumY += sin(angle) * lastAmplitudes[i] * 50; // Reducir la escala de la suma
        }
        let y = 150 + sumY;
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
        let y = yPos + sin(angle) * amplitude * 50; // Reducir la escala de la amplitud
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
    let newAmplitudes = [0.3, 0.4, 0.5, 0.6, -1, -0.2, 0.8, -0.7, 0.5, 0.2, -0.9]; // Los valores que quieres asignar

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
    let newAmplitudes = [0.1, -0.4, 0.5, -0.6, -1, -0.2, 0.3, -0.8, 0.6, 0.4, 0.1]; // Los valores que quieres asignar

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
    let newAmplitudes = [1, 0.4, 1, 0.6, -1, -0.2, 0.9, -0.5, 0.7, 0.3, -0.4]; // Los valores que quieres asignar

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
    let newAmplitudes = [-1, 0.4, -0.5, 0.6, -1, -0.2, 0.8, -0.6, 0.4, -0.3, 0.2]; // Los valores que quieres asignar

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



