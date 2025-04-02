// Configuración de 8 componentes (A0 a A7), con amplitudes y fases
let components = [
    { amp: 0, phase: 0 },          // A0
    { amp: 1.13201857, phase: -2.13770783 }, // A1
    { amp: 0, phase: 0 },          // A2
    { amp: 0.3253979754, phase: -1.77990097 }, // A3
    { amp: 0, phase: 0 },          // A4
    { amp: 0.19252778, phase: -1.69743886 },  // A5
    { amp: 0, phase: 0 },          // A6
    { amp: 0, phase: 0 }           // A7
];

let w = 8; // Frecuencia angular
let colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#54a0ff', '#9b59b6', '#ff9ff3']; // Paleta de colores moderna
let t = []; // Vector de tiempo
let bars = []; // Datos de las barras de amplitud
let phaseBars = []; // Datos de las barras de fase
let dragging = null; // Índice del componente que se está arrastrando
let draggingType = null; // Tipo de arrastre: 'amplitude' o 'phase'
let tooltipValue = null; // Para mostrar el valor mientras se arrastra

// Variables para los canvas
let individualCanvas, sumCanvas, barCanvas;

function setup() {
    // Crear el vector t desde 0 hasta T = 6π/w
    for (let i = 0; i < 800; i++) {
        t[i] = map(i, 0, 799, 0, 6 * PI / w);
    }

    // Crear canvas con las dimensiones ajustadas
    individualCanvas = createGraphics(800, 300);
    sumCanvas = createGraphics(800, 400);
    barCanvas = createGraphics(800, 250);

    let mainCanvas = createCanvas(800, 950);
    mainCanvas.parent('canvas-container');

    textSize(14);
    textFont('Poppins');

    // Configuración inicial de las barras (solo para A1 a A7)
    for (let i = 1; i < components.length; i++) {
        bars.push({
            x: (i - 1) * 120 + 30, // Espaciado aumentado de 100 a 120
            y: 80,
            width: 40,
            amplitude: components[i].amp,
            dragging: false
        });

        phaseBars.push({
            x: (i - 1) * 120 + 30, // Espaciado aumentado de 100 a 120
            y: 180,
            width: 40,
            phase: components[i].phase,
            dragging: false
        });
    }

    console.log("Setup completado. Canvas creado.");
}

function draw() {
    background(245, 247, 250);

    drawBars();
    drawIndividualSignals();
    drawSumSignal();

    image(barCanvas, 0, 0);
    image(individualCanvas, 0, 250);
    image(sumCanvas, 0, 550);

    // Mostrar tooltip si se está arrastrando
    if (dragging !== null) {
        let value = draggingType === 'amplitude' ? bars[dragging - 1].amplitude.toFixed(4) : phaseBars[dragging - 1].phase.toFixed(2);
        let label = draggingType === 'amplitude' ? `A${dragging}: ${value}` : `F${dragging}: ${value}`;
        fill(50, 50, 50, 220);
        noStroke();
        rect(mouseX + 15, mouseY - 30, textWidth(label) + 20, 30, 10);
        fill(255);
        textAlign(CENTER, CENTER);
        text(label, mouseX + 15 + textWidth(label) / 2 + 10, mouseY - 15);
    }
}

function drawBars() {
    barCanvas.background(255);
    barCanvas.strokeWeight(1);

    // Fondo para las barras
    barCanvas.fill(240, 242, 245);
    barCanvas.noStroke();
    barCanvas.rect(10, 10, 780, 230, 15);

    // Títulos de las secciones
    barCanvas.fill(44, 62, 80);
    barCanvas.textAlign(CENTER, CENTER);
    barCanvas.textStyle(BOLD);
    barCanvas.text('Amplitudes (A)', 400, 40);
    barCanvas.text('Fases (F)', 400, 140);

    // Líneas de referencia
    barCanvas.stroke(200);
    barCanvas.strokeWeight(1);
    barCanvas.line(20, 80, 780, 80); // Línea base para amplitudes
    barCanvas.line(20, 180, 780, 180); // Línea base para fases

    // Dibujar barras de amplitud y fase
    for (let i = 1; i < components.length; i++) {
        // Barra de amplitud
        let bar = bars[i - 1];
        barCanvas.fill(colors[i - 1]);
        barCanvas.stroke(44, 62, 80);
        barCanvas.strokeWeight(bar.dragging ? 2 : 1);
        barCanvas.rect(bar.x, bar.y, bar.width, -bar.amplitude * 50, 8);

        // Barra de fase
        let phaseBar = phaseBars[i - 1];
        barCanvas.fill(lightenColor(colors[i - 1], 50));
        barCanvas.stroke(44, 62, 80);
        barCanvas.strokeWeight(phaseBar.dragging ? 2 : 1);
        barCanvas.rect(phaseBar.x, phaseBar.y, phaseBar.width, -phaseBar.phase * 30, 8);

        // Etiquetas
        barCanvas.fill(44, 62, 80);
        barCanvas.noStroke();
        barCanvas.textAlign(CENTER, CENTER);
        barCanvas.textStyle(NORMAL);
        barCanvas.text(`A${i}: ${bar.amplitude.toFixed(4)}`, bar.x + bar.width / 2, 110);
        barCanvas.text(`F${i}: ${phaseBar.phase.toFixed(2)}`, phaseBar.x + phaseBar.width / 2, 220);
    }
}

function drawIndividualSignals() {
    individualCanvas.background(255);

    // Fondo con cuadrícula
    individualCanvas.stroke(230);
    individualCanvas.strokeWeight(1);
    for (let y = 50; y <= 250; y += 50) {
        individualCanvas.line(0, y, 800, y);
    }
    for (let x = 0; x <= 800; x += 100) {
        individualCanvas.line(x, 0, x, 300);
    }

    // Ejes
    individualCanvas.stroke(100);
    individualCanvas.strokeWeight(2);
    individualCanvas.line(0, 150, 800, 150); // Eje X
    individualCanvas.line(0, 0, 0, 300); // Eje Y

    // Etiquetas de ejes
    individualCanvas.fill(44, 62, 80);
    individualCanvas.noStroke();
    individualCanvas.textAlign(CENTER, CENTER);
    individualCanvas.text('Tiempo', 400, 290);
    individualCanvas.text('Amplitud', 20, 20);

    // Señales individuales
    individualCanvas.strokeWeight(2);
    for (let i = 1; i < components.length; i++) {
        individualCanvas.stroke(colors[i - 1]);
        individualCanvas.noFill();
        individualCanvas.beginShape();
        for (let x = 0; x < 800; x++) {
            let y = 150 + components[i].amp * 50 * cos((i) * w * t[x] + components[i].phase);
            individualCanvas.vertex(x, y);
        }
        individualCanvas.endShape();
    }
}

function drawSumSignal() {
    sumCanvas.background(255);

    // Fondo con cuadrícula
    sumCanvas.stroke(230);
    sumCanvas.strokeWeight(1);
    for (let y = 50; y <= 350; y += 50) {
        sumCanvas.line(0, y, 800, y);
    }
    for (let x = 0; x <= 800; x += 100) {
        sumCanvas.line(x, 0, x, 400);
    }

    // Ejes
    sumCanvas.stroke(100);
    sumCanvas.strokeWeight(2);
    sumCanvas.line(0, 200, 800, 200); // Eje X
    sumCanvas.line(0, 0, 0, 400); // Eje Y

    // Etiquetas de ejes
    sumCanvas.fill(44, 62, 80);
    sumCanvas.noStroke();
    sumCanvas.textAlign(CENTER, CENTER);
    sumCanvas.text('Tiempo', 400, 390);
    sumCanvas.text('Amplitud', 20, 20);

    // Suma de señales
    sumCanvas.stroke('#2c3e50');
    sumCanvas.strokeWeight(3);
    sumCanvas.noFill();
    sumCanvas.beginShape();
    for (let x = 0; x < 800; x++) {
        let sumY = components[0].amp * 50;
        for (let i = 1; i < components.length; i++) {
            sumY += components[i].amp * 50 * cos((i) * w * t[x] + components[i].phase);
        }
        sumCanvas.vertex(x, 200 + sumY);
    }
    sumCanvas.endShape();
}

// Interacción con el mouse
function mousePressed() {
    console.log("Clic en mouseX = " + mouseX + ", mouseY = " + mouseY);
    for (let i = 1; i < components.length; i++) {
        let phaseBar = phaseBars[i - 1];
        if (mouseX > phaseBar.x && mouseX < phaseBar.x + phaseBar.width && mouseY > phaseBar.y - 30 && mouseY < phaseBar.y + 30) {
            console.log("Clic detectado en la barra de fase F" + i + " en y = " + mouseY);
            phaseBar.dragging = true;
            dragging = i;
            draggingType = 'phase';
            return;
        }

        let bar = bars[i - 1];
        if (mouseX > bar.x && mouseX < bar.x + bar.width && mouseY > bar.y - 30 && mouseY < bar.y + 30) {
            console.log("Clic detectado en la barra de amplitud A" + i + " en y = " + mouseY);
            bar.dragging = true;
            dragging = i;
            draggingType = 'amplitude';
            return;
        }
    }
    dragging = null;
    draggingType = null;
}

function mouseDragged() {
    if (dragging !== null) {
        if (draggingType === 'amplitude') {
            let bar = bars[dragging - 1];
            bar.amplitude = constrain((80 - mouseY) / 40, -1, 1);
            components[dragging].amp = bar.amplitude;
        } else if (draggingType === 'phase') {
            let phaseBar = phaseBars[dragging - 1];
            phaseBar.phase = normalizePhase(constrain((180 - mouseY) / 30, -PI, PI)); // Sensibilidad reducida de /15 a /30
            components[dragging].phase = phaseBar.phase;
        }
    }
}

function mouseReleased() {
    for (let i = 1; i < components.length; i++) {
        bars[i - 1].dragging = false;
        phaseBars[i - 1].dragging = false;
    }
    dragging = null;
    draggingType = null;
}

// Envolver los eventos en window.onload para asegurar que el DOM esté cargado
window.onload = function() {
    console.log("DOM cargado, configurando eventos...");
    
    document.getElementById('ejem1').addEventListener('click', () => {
        updateComponents(
            [0.5, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1, 0.05],
            [0, PI/4, PI/3, PI/2, PI, 0, PI/6, PI/8]
        );
        console.log("Ejemplo 1 cargado");
    });

    document.getElementById('ejem2').addEventListener('click', () => {
        updateComponents(
            [0.2, 0.7, 0.5, 0.3, 0.1, 0.4, 0.2, 0.1],
            [PI/2, PI/4, PI/3, 0, PI/6, PI, PI/2, 0]
        );
        console.log("Ejemplo 2 cargado");
    });

    document.getElementById('ejem3').addEventListener('click', () => {
        updateComponents(
            [1.0, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
            [0, PI, PI/2, PI/4, PI/3, 0, PI/2, PI]
        );
        console.log("Ejemplo 3 cargado");
    });

    document.getElementById('ejem4').addEventListener('click', () => {
        updateComponents(
            [0, 0.9, 0, 0.6, 0, 0.3, 0, 0.1],
            [0, 0, PI/2, PI/2, PI, PI, 0, PI/4]
        );
        console.log("Ejemplo 4 cargado");
    });
};

function updateComponents(amps, phases = []) {
    for (let i = 0; i < components.length; i++) {
        components[i].amp = amps[i] || 0;
        components[i].phase = phases[i] || 0;
        if (i > 0) {
            bars[i - 1].amplitude = components[i].amp;
            phaseBars[i - 1].phase = components[i].phase;
        }
    }
    console.log("Componentes actualizados:", components);
}

function normalizePhase(phase) {
    while (phase > PI) phase -= 2 * PI;
    while (phase < -PI) phase += 2 * PI;
    return phase;
}

function lightenColor(col, amt) {
    let c = color(col);
    let r = red(c) + amt;
    let g = green(c) + amt;
    let b = blue(c) + amt;
    return color(r, g, b);
}