// Configuración de 12 componentes (A0 a A11), con amplitudes y fases
let components = [
    { amp: 0, phase: 0 },  // A0 (solo para la suma)
    { amp: 0, phase: 0 },  // A1
    { amp: 0, phase: 0 },  // A2
    { amp: 0, phase: 0 },  // A3
    { amp: 0, phase: 0 },  // A4
    { amp: 0, phase: 0 },  // A5
    { amp: 0, phase: 0 },  // A6
    { amp: 0, phase: 0 },  // A7
    { amp: 0, phase: 0 },  // A8
    { amp: 0, phase: 0 },  // A9
    { amp: 0, phase: 0 },  // A10
    { amp: 0, phase: 0 }   // A11
];

let w = 1; // Frecuencia angular
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'gray', 'cyan', 'magenta'];
let t = []; // Vector de tiempo
let bars = []; // Datos de las barras
let dragging = null;

// Variables para los canvas
let individualCanvas, sumCanvas, barCanvas;

function setup() {
    // Crear el vector t desde 0 hasta T = 6π/w
    for (let i = 0; i < 800; i++) {
        t[i] = map(i, 0, 799, 0, 6 * PI / w); // Mapea 800 puntos de 0 a 6π/w
    }

    // Crear canvas con las dimensiones originales
    individualCanvas = createGraphics(800, 300);
    sumCanvas = createGraphics(800, 400);
    barCanvas = createGraphics(800, 150);

    let mainCanvas = createCanvas(800, 850);
    mainCanvas.parent('canvas-container');

    textSize(15);

    // Configuración inicial de las barras (solo para A1 a A11)
    for (let i = 1; i < components.length; i++) {
        bars.push({
            x: (i - 1) * 70 + 15, // Reducir el espaciado a 65 píxeles para que quepan 11 barras
            y: 100, // Posición en y
            width: 40, // Ancho de la barra
            amplitude: components[i].amp, // Amplitud
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
    image(individualCanvas, 0, 150);
    image(sumCanvas, 0, 450);

    console.log("Dibujando frame...");
}

function drawBars() {
    barCanvas.background(255); // Fondo blanco para las barras
    barCanvas.strokeWeight(2);

    // Dibujar barras con espaciado ajustado, comenzando desde A1 (i = 1)
    for (let i = 1; i < components.length; i++) {
        let bar = bars[i - 1];
        barCanvas.fill(colors[i - 1]);
        barCanvas.rect(bar.x, bar.y, bar.width, -bar.amplitude * 50); // Escala de las barras

        // Mostrar la amplitud y la fase
        barCanvas.fill(0);
        barCanvas.text('A' + i + ': ' + bar.amplitude.toFixed(4), bar.x + bar.width / 2, 20);
        barCanvas.text('F' + i + ': ' + components[i].phase.toFixed(2), bar.x + bar.width / 2, 40);
    }
}

function drawIndividualSignals() {
    individualCanvas.background(255); // Fondo blanco para las señales individuales
    individualCanvas.strokeWeight(2); // Grosor de línea como en el diseño antiguo

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
    sumCanvas.stroke('blue'); // Color azul como en el diseño antiguo
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
        let bar = bars[i - 1];
        if (mouseX > bar.x && mouseX < bar.x + bar.width && mouseY > bar.y - 150 && mouseY < bar.y + 150) {
            bar.dragging = true;
            dragging = i;
            return;
        }
    }
    dragging = null;
}

function mouseDragged() {
    if (dragging !== null) {
        let bar = bars[dragging - 1];
        bar.amplitude = constrain((100 - mouseY) / 100, -1, 1); // Ajustar el rango a [-1, 1]
        components[dragging].amp = bar.amplitude; // Actualizar la amplitud en components
    }
}

function mouseReleased() {
    for (let i = 1; i < components.length; i++) {
        bars[i - 1].dragging = false;
    }
    dragging = null;
}

// Envolver los eventos en window.onload para asegurar que el DOM esté cargado
window.onload = function() {
    console.log("DOM cargado, configurando eventos...");
    
    document.getElementById('ejem1').addEventListener('click', () => {
        updateComponents(
            [0.5, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005],
            [0, PI/4, PI/3, PI/2, PI, 0, PI/6, PI/4, PI/3, PI/2, 0, 0]
        );
        console.log("Ejemplo 1 cargado");
    });

    document.getElementById('ejem2').addEventListener('click', () => {
        updateComponents(
            [0.2, 0.7, 0.5, 0.3, 0.1, 0.4, 0.6, 0.2, 0.1, 0.05, 0.02, 0.01],
            [PI/2, PI/4, PI/3, 0, PI/6, PI, PI/2, PI/4, 0, PI/3, PI/2, 0]
        );
        console.log("Ejemplo 2 cargado");
    });

    document.getElementById('ejem3').addEventListener('click', () => {
        updateComponents(
            [1.0, 0.5, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005, 0.002, 0.001],
            [0, PI, PI/2, PI/4, PI/3, 0, PI/6, PI/2, PI/4, PI/3, 0, 0]
        );
        console.log("Ejemplo 3 cargado");
    });

    document.getElementById('ejem4').addEventListener('click', () => {
        updateComponents(
            [0, 0.9, 0, 0.6, 0, 0.3, 0, 0.15, 0, 0.07, 0, 0.03],
            [0, 0, PI/2, PI/2, PI, PI, 3*PI/2, 3*PI/2, 0, 0, PI/2, 0]
        );
        console.log("Ejemplo 4 cargado");
    });
};

function updateComponents(amps, phases = []) {
    for (let i = 0; i < components.length; i++) {
        components[i].amp = amps[i] || 0;
        components[i].phase = phases[i] || 0;
        if (i > 0) { // Actualizar las barras solo para A1 a A11
            bars[i - 1].amplitude = components[i].amp;
        }
    }
    console.log("Componentes actualizados:", components);
}