let maxHarmonics = 3; // Número de armónicas
let amplitudes = [0, 0, 0]; // Amplitudes iniciales
let lastAmplitudes = [0, 0, 0]; // Almacena las últimas amplitudes
let bars = []; // Datos de las barras
let colors = ['red', 'orange', 'yellow']; // Colores para cada armónica

function drawAxes() {
    let axisColor = '#000';
    let margin = 40;
    let numMarks = 10; // Número de marcas en cada eje
    let spacingX = (width - 2 * margin) / numMarks;
    let spacingY = (height - 2 * margin) / numMarks;

    // Dibuja los ejes
    stroke(axisColor);
    strokeWeight(2);
    line(margin, height - margin, width - margin, height - margin); // Eje X
    line(margin, margin, margin, height - margin); // Eje Y

    // Añade marcas y texto en el eje X
    textAlign(CENTER, CENTER);
    for (let i = 0; i <= numMarks; i++) {
        let x = margin + i * spacingX;
        strokeWeight(1);
        line(x, height - margin - 5, x, height - margin + 5); // Marca pequeña
        noStroke();
        fill(axisColor);
        text(i, x, height - margin + 20); // Texto numérico
    }

    // Añade marcas y texto en el eje Y
    for (let i = 0; i <= numMarks; i++) {
        let y = height - margin - i * spacingY;
        strokeWeight(1);
        line(margin - 5, y, margin + 5, y); // Marca pequeña
        noStroke();
        fill(axisColor);
        text(i, margin - 20, y); // Texto numérico
    }
}


function setup() {
    createCanvas(800, 600);
    textSize(15);

    // Configuración inicial de las barras
    for (let i = 0; i < maxHarmonics; i++) {
        bars.push({
            x: i * 80 + 100, // Posición en x
            y: 100, // Posición en y
            width: 50, // Ancho
            amplitude: amplitudes[i], // Amplitud
            dragging: false // Estado de arrastre
        });
    }
}

function draw() {
    background(255); // Fondo blanco
    drawAxes();
    drawBars();
    drawSignals();
}

function drawAxes() {
    let leftMargin = 50;
    let rightMargin = width - 50;
    let bottomMargin = height - 50;
    let topMargin = 50;

    // Dibuja los ejes cartesianos
    stroke(0);
    strokeWeight(1);
    line(leftMargin, bottomMargin, rightMargin, bottomMargin); // Eje X
    line(leftMargin, topMargin, leftMargin, bottomMargin); // Eje Y

    // Dibuja las marcas del eje X
    for (let i = leftMargin; i <= rightMargin; i += (rightMargin - leftMargin) / 20) {
        line(i, bottomMargin - 5, i, bottomMargin + 5); // Marcas del eje X
    }

    // Dibuja las marcas del eje Y
    for (let i = bottomMargin; i >= topMargin; i -= (bottomMargin - topMargin) / 10) {
        line(leftMargin - 5, i, leftMargin + 5, i); // Marcas del eje Y
    }
}

function drawBars() {
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        fill(colors[i]); // Color correspondiente
        rect(bar.x, bar.y, bar.width, -bar.amplitude * 100); // Dibuja la barra
        fill(0); // Texto en negro
        text('A' + (i + 1) + ': ' + bar.amplitude.toFixed(2), bar.x, 20); // Muestra la amplitud
    }
}

function drawSignals() {
    strokeWeight(2);
    // Dibuja las señales armónicas estáticas para aquellas no siendo arrastradas
    for (let i = 0; i < maxHarmonics; i++) {
        if (!bars[i].dragging) {
            drawSingleHarmonic(i, 300, lastAmplitudes[i]);
        }
    }
    // Dibuja las señales armónicas dinámicas solo para la que se está arrastrando
    for (let i = 0; i < maxHarmonics; i++) {
        if (bars[i].dragging) {
            drawSingleHarmonic(i, 300, bars[i].amplitude);
            lastAmplitudes[i] = bars[i].amplitude; // Actualiza la última amplitud conocida
        }
    }
    strokeWeight(1); // Restaura el grosor de la línea
}

function drawSingleHarmonic(index, yPos, amplitude) {
    beginShape();
    stroke(colors[index]);
    noFill();
    for (let x = 0; x < width; x++) {
        let angle = TWO_PI * (index + 1) * (x / width) * 2; // Factor de 2 para el rango completo
        let y = yPos + sin(angle) * amplitude * 100; // Escala de la amplitud
        vertex(x, y);
    }
    endShape();
}

function mousePressed() {
    for (let i = 0; i < maxHarmonics; i++) {
        let bar = bars[i];
        if (mouseX > bar.x && mouseX < bar.x + bar.width && mouseY > bar.y - 150 && mouseY < bar.y + 150) {
            bar.dragging = true;
            return; // Detiene la búsqueda una vez que una barra es seleccionada
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
            bar.amplitude = constrain((100 - mouseY) / 100, -1.5, 1.5);
            return; // Detiene la búsqueda una vez que una barra es ajustada
        }
    }
}
