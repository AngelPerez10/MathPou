// Configuración de 6 componentes (A0 a A5), con amplitudes y fases
let components = [
    { amp: 0, phase: 0 },          // A0
    { amp: 1.13201857, phase: -2.13770783 }, // A1
    { amp: 0, phase: 0 },          // A2
    { amp: 0.3253979754, phase: -1.77990097 }, // A3
    { amp: 0, phase: 0 },          // A4
    { amp: 0.19252778, phase: -1.69743886 }  // A5
];

let w = 8; // Frecuencia angular
let colors = ['red', 'orange', 'yellow', 'green', 'blue'];
let t = []; // Vector de tiempo
let bars = []; // Datos de las barras de amplitud
let phaseBars = []; // Datos de las barras de fase
let dragging = null; // Índice del componente que se está arrastrando
let draggingType = null; // Tipo de arrastre: 'amplitude' o 'phase'

// Variables para los canvas
let individualCanvas, sumCanvas, barCanvas;

function setup() {
    // Crear el vector t desde 0 hasta T = 6π/w
    for (let i = 0; i < 800; i++) {
        t[i] = map(i, 0, 799, 0, 6 * PI / w); // Mapea 800 puntos de 0 a 6π/w
    }

    // Crear canvas con las dimensiones ajustadas
    individualCanvas = createGraphics(800, 300);
    sumCanvas = createGraphics(800, 400);
    barCanvas = createGraphics(800, 200); // Aumentar la altura para las barras de fase

    let mainCanvas = createCanvas(800, 900); // Ajustar la altura del canvas principal
    mainCanvas.parent('canvas-container');

    textSize(12); // Reducir el tamaño del texto para mejor legibilidad

    // Configuración inicial de las barras (solo para A1 a A5)
    for (let i = 1; i < components.length; i++) {
        // Barras de amplitud
        bars.push({
            x: (i - 1) * 140 + 15, // Espaciado más grande para 5 barras
            y: 80, // Posición en y para las barras de amplitud
            width: 40, // Ancho de la barra
            amplitude: components[i].amp, // Amplitud
            dragging: false // Estado de arrastre
        });

        // Barras de fase
        phaseBars.push({
            x: (i - 1) * 140 + 15, // Mismo espaciado que las barras de amplitud
            y: 150, // Posición en y para las barras de fase (debajo de las de amplitud)
            width: 40, // Ancho de la barra
            phase: components[i].phase, // Fase
            dragging: false // Estado de arrastre
        });
    }

    console.log("Setup completado. Canvas creado.");
}

function draw() {
    background(255); // Fondo blanco para el canvas principal

    drawBars();
    drawIndividualSignals();
    drawSumSignal();

    image(barCanvas, 0, 0);
    image(individualCanvas, 0, 200); // Ajustar la posición para la mayor altura de barCanvas
    image(sumCanvas, 0, 500);

    console.log("Dibujando frame...");
}

function drawBars() {
    barCanvas.background(255); // Fondo blanco para las barras
    barCanvas.strokeWeight(2);

    // Dibujar barras de amplitud y fase, comenzando desde A1 (i = 1)
    for (let i = 1; i < components.length; i++) {
        // Barra de amplitud
        let bar = bars[i - 1];
        barCanvas.fill(colors[i - 1]);
        barCanvas.rect(bar.x, bar.y, bar.width, -bar.amplitude * 50); // Escala de las barras

        // Barra de fase (usar un color más claro)
        let phaseBar = phaseBars[i - 1];
        barCanvas.fill(lightenColor(colors[i - 1], 50)); // Función para aclarar el color
        barCanvas.rect(phaseBar.x, phaseBar.y, phaseBar.width, -phaseBar.phase * 10); // Escala de las fases

        // Mostrar la amplitud y la fase
        barCanvas.fill(0);
        barCanvas.textAlign(CENTER, CENTER);
        barCanvas.text('A' + i + ': ' + bar.amplitude.toFixed(4), bar.x + bar.width / 2, 20);
        barCanvas.text('F' + i + ': ' + phaseBar.phase.toFixed(2), phaseBar.x + phaseBar.width / 2, 180);
    }
}

function drawIndividualSignals() {
    individualCanvas.background(255); // Fondo blanco para las señales individuales
    individualCanvas.strokeWeight(2); // Grosor de línea

    // Comenzar desde A1 (i = 1)
    for (let i = 1; i < components.length; i++) {
        individualCanvas.stroke(colors[i - 1]);
        individualCanvas.noFill();
        individualCanvas.beginShape();
        
        for (let x = 0; x < 800; x++) {
            let y = 150 + components[i].amp * 50 * cos((i) * w * t[x] + components[i].phase); // (i)ωt + Fi
            individualCanvas.vertex(x, y);
        }
        individualCanvas.endShape();
    }
}

function drawSumSignal() {
    sumCanvas.background(255); // Fondo blanco para la suma
    sumCanvas.strokeWeight(2);
    sumCanvas.stroke('blue'); // Color azul
    sumCanvas.noFill();
    sumCanvas.beginShape();
    
    for (let x = 0; x < 800; x++) {
        let sumY = components[0].amp * 50; // Incluir A0 en la suma
        
        for (let i = 1; i < components.length; i++) {
            sumY += components[i].amp * 50 * cos((i) * w * t[x] + components[i].phase); // (i)ωt + Fi
        }
        
        sumCanvas.vertex(x, 200 + sumY);
    }
    sumCanvas.endShape();
}

// Interacción con el mouse
function mousePressed() {
    // Comenzar desde A1 (i = 1)
    for (let i = 1; i < components.length; i++) {
        // Verificar si se está arrastrando una barra de amplitud
        let bar = bars[i - 1];
        if (mouseX > bar.x && mouseX < bar.x + bar.width && mouseY > bar.y - 150 && mouseY < bar.y + 150) {
            bar.dragging = true;
            dragging = i;
            draggingType = 'amplitude';
            return;
        }

        // Verificar si se está arrastrando una barra de fase
        let phaseBar = phaseBars[i - 1];
        if (mouseX > phaseBar.x && mouseX < phaseBar.x + phaseBar.width && mouseY > phaseBar.y - 150 && mouseY < phaseBar.y + 150) {
            phaseBar.dragging = true;
            dragging = i;
            draggingType = 'phase';
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
            bar.amplitude = constrain((80 - mouseY) / 80, -1, 1); // Ajustar el rango a [-1, 1]
            components[dragging].amp = bar.amplitude; // Actualizar la amplitud en components
        } else if (draggingType === 'phase') {
            let phaseBar = phaseBars[dragging - 1];
            phaseBar.phase = constrain((150 - mouseY) / 30, -2 * PI, 2 * PI); // Ajustar el rango a [-2π, 2π]
            components[dragging].phase = phaseBar.phase; // Actualizar la fase en components
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
            [0.5, 0.8, 0.6, 0.4, 0.3, 0.2],
            [0, PI/4, PI/3, PI/2, PI, 0]
        );
        console.log("Ejemplo 1 cargado");
    });

    document.getElementById('ejem2').addEventListener('click', () => {
        updateComponents(
            [0.2, 0.7, 0.5, 0.3, 0.1, 0.4],
            [PI/2, PI/4, PI/3, 0, PI/6, PI]
        );
        console.log("Ejemplo 2 cargado");
    });

    document.getElementById('ejem3').addEventListener('click', () => {
        updateComponents(
            [1.0, 0.5, 0.3, 0.2, 0.1, 0.05],
            [0, PI, PI/2, PI/4, PI/3, 0]
        );
        console.log("Ejemplo 3 cargado");
    });

    document.getElementById('ejem4').addEventListener('click', () => {
        updateComponents(
            [0, 0.9, 0, 0.6, 0, 0.3],
            [0, 0, PI/2, PI/2, PI, PI]
        );
        console.log("Ejemplo 4 cargado");
    });
};

function updateComponents(amps, phases = []) {
    for (let i = 0; i < components.length; i++) {
        components[i].amp = amps[i] || 0;
        components[i].phase = phases[i] || 0;
        if (i > 0) { // Actualizar las barras solo para A1 a A5
            bars[i - 1].amplitude = components[i].amp;
            phaseBars[i - 1].phase = components[i].phase;
        }
    }
    console.log("Componentes actualizados:", components);
}

// Función para aclarar un color (simplificada para p5.js)
function lightenColor(col, amt) {
    let c = color(col);
    let r = red(c) + amt;
    let g = green(c) + amt;
    let b = blue(c) + amt;
    return color(r, g, b);
}