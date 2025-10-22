// Configuración de 12 componentes (A0 a A11), con amplitudes y fases
let components = [
    { amp: 0, phase: 0 },          // A0 (término constante - editable)
    { amp: 0, phase: 0 },          // A1
    { amp: 0, phase: 0 },          // A2
    { amp: 0, phase: 0 },          // A3
    { amp: 0, phase: 0 },          // A4
    { amp: 0, phase: 0 },          // A5
    { amp: 0, phase: 0 },          // A6
    { amp: 0, phase: 0 },          // A7
    { amp: 0, phase: 0 },          // A8
    { amp: 0, phase: 0 },          // A9
    { amp: 0, phase: 0 },          // A10
    { amp: 0, phase: 0 }           // A11
];

let w = 8; // Frecuencia angular
let colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#54a0ff', '#9b59b6', '#ff9ff3', '#00d2d3', '#e84393', '#2ecc71', '#8e44ad']; // Paleta de colores extendida para 11 armónicos
let t = []; // Vector de tiempo
let bars = []; // Datos de las barras de amplitud
let phaseBars = []; // Datos de las barras de fase
let dragging = null; // Índice del componente que se está arrastrando
let draggingType = null; // Tipo de arrastre: 'amplitude' o 'phase'
let tooltipValue = null; // Para mostrar el valor mientras se arrastra

// Variables para los canvas
let individualCanvas, sumCanvas, barCanvas;

// Eliminado: barras fijas para A0. A0 ahora usa el mismo esquema de barras que A1-A11.

function setup() {
    // Crear el vector t desde 0 hasta T = 6π/w
    for (let i = 0; i < 800; i++) {
        t[i] = map(i, 0, 799, 0, 6 * PI / w);
    }

    // Crear canvas con las dimensiones ajustadas
    individualCanvas = createGraphics(800, 300);
    sumCanvas = createGraphics(800, 400);
    barCanvas = createGraphics(800, 250);

    let mainCanvas = createCanvas(800, 950); // Canvas principal más ancho
    mainCanvas.parent('canvas-container');

    textSize(14);
    textFont('Poppins');

    // Configuración inicial de las barras (A0 a A11)
    for (let i = 0; i < components.length; i++) {
        bars.push({
            x: i * 65 + 30, // Espaciado ajustado, A0 empieza en 30
            y: 80,
            width: 30,
            amplitude: components[i].amp,
            dragging: false
        });

        phaseBars.push({
            x: i * 65 + 30,
            y: 180,
            width: 30,
            phase: components[i].phase,
            dragging: false
        });
    }
    console.log("Setup completado. Canvas creado.");
    console.log("A0 ahora es editable junto con A1-A11.");
}

function draw() {
    background(245, 247, 250);

    drawBars();
    drawIndividualSignals();
    drawSumSignal();

    // Dibujar en orden correcto: barras arriba, señales individuales en medio, suma abajo
    image(barCanvas, 0, 0);        // Canvas de barras (amplitudes y fases) - ARRIBA
    image(individualCanvas, 0, 250); // Señales individuales - MEDIO
    image(sumCanvas, 0, 550);      // Señal suma - ABAJO

    // Mostrar tooltip si se está arrastrando
    if (dragging !== null) {
        let value;
        if (draggingType === 'amplitude') {
            const bar = bars[dragging];
            value = (bar ? bar.amplitude : components[dragging]?.amp || 0).toFixed(4);
        } else {
            const pbar = phaseBars[dragging];
            value = (pbar ? pbar.phase : components[dragging]?.phase || 0).toFixed(2);
        }
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

    // (A0 fijo eliminado): ahora A0 se maneja como cualquier barra mediante arrays bars/phaseBars

    // Dibujar barras de amplitud y fase para A0-A11
    for (let i = 0; i < components.length; i++) {
        // Barra de amplitud
        let bar = bars[i];
        const colAmp = (i === 0) ? '#2c3e50' : (colors[i - 1] || '#54a0ff');
        barCanvas.fill(colAmp);
        barCanvas.stroke(44, 62, 80);
        barCanvas.strokeWeight(bar.dragging ? 2 : 1);
        barCanvas.rect(bar.x, bar.y, bar.width, -bar.amplitude * 50, 8);

        // Barra de fase
        let phaseBar = phaseBars[i];
        const colPhase = (i === 0) ? lightenColor('#2c3e50', 30) : lightenColor((colors[i - 1] || '#54a0ff'), 50);
        barCanvas.fill(colPhase);
        barCanvas.stroke(44, 62, 80);
        barCanvas.strokeWeight(phaseBar.dragging ? 2 : 1);
        barCanvas.rect(phaseBar.x, phaseBar.y, phaseBar.width, -phaseBar.phase * 30, 8);

        // Etiquetas
        barCanvas.fill(44, 62, 80);
        barCanvas.noStroke();
        barCanvas.textAlign(CENTER, CENTER);
        barCanvas.textStyle(NORMAL);
        barCanvas.text(`A${i}`, bar.x + bar.width / 2, 110);
        barCanvas.text(`\u03C6${i}`, phaseBar.x + phaseBar.width / 2, 220);
    }
}

function drawIndividualSignals() {
    individualCanvas.background(255);

    // Fondo con cuadrícula
    individualCanvas.stroke(230);
    individualCanvas.strokeWeight(1);
    for (let y = 50; y <= 250; y += 50) {
        individualCanvas.line(0, y, 800, y); // Línea ajustada al nuevo ancho
    }
    for (let x = 0; x <= 800; x += 100) { // Líneas verticales ajustadas
        individualCanvas.line(x, 0, x, 300);
    }

    // Ejes
    individualCanvas.stroke(100);
    individualCanvas.strokeWeight(2);
    individualCanvas.line(0, 150, 800, 150); // Eje X ajustado al nuevo ancho
    individualCanvas.line(0, 0, 0, 300); // Eje Y

    // Etiquetas de ejes
    individualCanvas.fill(44, 62, 80);
    individualCanvas.noStroke();
    individualCanvas.textAlign(CENTER, CENTER);
    individualCanvas.text('Tiempo', 400, 290);
    individualCanvas.text('Amplitud', 20, 20);

    // Señales individuales (incluyendo A0)
    individualCanvas.strokeWeight(2);

    // Dibujar A0 (término constante) - línea horizontal en su valor (offset DC)
    individualCanvas.stroke('#2c3e50');
    individualCanvas.strokeWeight(3);
    const a0OffsetY = 150 - components[0].amp * 50; // Offset de A0
    individualCanvas.line(0, a0OffsetY, 800, a0OffsetY);

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

    // Suma de señales (A0 aporta un offset constante)
    sumCanvas.stroke('#2c3e50');
    sumCanvas.strokeWeight(3);
    sumCanvas.noFill();
    sumCanvas.beginShape();
    for (let x = 0; x < 800; x++) {
        let sumY = components[0].amp * 50; // A0 como DC
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

    // Verificar si se hizo clic en alguna barra (A0-A11)
    for (let i = 0; i < components.length; i++) {
        let phaseBar = phaseBars[i];
        if (phaseBar && mouseX > phaseBar.x && mouseX < phaseBar.x + phaseBar.width && mouseY > phaseBar.y - 30 && mouseY < phaseBar.y + 30) {
            console.log("Clic detectado en la barra de fase F" + i + " en y = " + mouseY);
            phaseBar.dragging = true;
            dragging = i;
            draggingType = 'phase';
            return;
        }

        let bar = bars[i];
        if (bar && mouseX > bar.x && mouseX < bar.x + bar.width && mouseY > bar.y - 30 && mouseY < bar.y + 30) {
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
    if (dragging !== null) { // Permitir arrastre para A0-A11
        if (draggingType === 'amplitude') {
            let bar = bars[dragging];
            if (bar) {
                bar.amplitude = constrain((80 - mouseY) / 40, -1, 1);
                components[dragging].amp = bar.amplitude;
            }
        } else if (draggingType === 'phase') {
            let phaseBar = phaseBars[dragging];
            if (phaseBar) {
                phaseBar.phase = normalizePhase(constrain((180 - mouseY) / 30, -PI, PI));
                components[dragging].phase = phaseBar.phase;
            } else if (dragging === 0) {
                // Fase de A0 no afecta; mantener en 0
                components[0].phase = 0;
            }
        }
    }
    // Nota: A0 (índice 0) NO se puede arrastrar - es fijo
}

function mouseReleased() {
    for (let i = 0; i < components.length; i++) {
        if (bars[i]) bars[i].dragging = false;
        if (phaseBars[i]) phaseBars[i].dragging = false;
    }
    dragging = null;
    draggingType = null;
}

// Envolver los eventos en window.onload para asegurar que el DOM esté cargado
window.onload = function() {
    console.log("DOM cargado, configurando eventos...");
    
    document.getElementById('ejem1').addEventListener('click', () => {
        // Cargar componentes A1-A11, A0 se mantiene en 0
        loadExampleComponents(
            [0.8, 0.6, 0.4, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005], // Amplitudes A1-A11
            [PI/4, PI/3, PI/2, PI, 0, PI/6, PI/8, PI/10, PI/12, PI/14, PI/16] // Fases A1-A11
        );
        console.log("Ejemplo 1 cargado - A0=0 (fijo)");
    });

    document.getElementById('ejem2').addEventListener('click', () => {
        loadExampleComponents(
            [1, 0, 0.11111111, 0, 0.04, 0, 0.02040816, 0, 0.01234568, 0, 0.00826446], // Amplitudes A1-A11
            [-1.57079632, 1.69914315, 1.57079632, -1.57895407, -1.57079632, 1.56113291, -1.57079632, -1.5205868, 1.57079632, 1.57351257, -1.57079632] // Fases A1-A11
        );
        console.log("Ejemplo 2 cargado como onda triangular aproximada - A0=0 (fijo)");
    });

    document.getElementById('ejem3').addEventListener('click', () => {
        loadExampleComponents(
            [0.82699335, 0.41349667, 0, 0.20674834, 0.16539867, 0, 0.11814191, 0.10337432, 0, 0.08269934, 0.07518122], // Amplitudes A1-A11
            [-2.0943951, -1.04719755, -3.14159265, -2.0943951, -1.04719755, -3.14159265, -2.0943951, -1.04719755, -3.14159265, -2.0943951, -1.04719755] // Fases A1-A11
        );
        console.log("Ejemplo 3 cargado con valores de la tabla - A0=0 (fijo)");
    });

    document.getElementById('ejem4').addEventListener('click', () => {
        loadExampleComponents(
            [1, 0, 0.28744933, 0, 0.17007476, 0, 0.12100643, 0, 0.09396349, 0, 0.07681592], // Amplitudes A1-A11
            [-1.00388482, 0, -1.36169169, 0, -1.44415379, 0, 1.48010015, 0, 1.50017842, 0, 1.51298629] // Fases A1-A11
        );
        console.log("Ejemplo 4 cargado con valores de la tabla - A0=0 (fijo)");
    });

    // Botón limpiar: restablecer A0-A11 a 0
    const btnClear = document.getElementById('btn_clear_pulso');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            for (let i = 0; i < components.length; i++) {
                components[i].amp = 0;
                components[i].phase = 0;
                if (bars[i]) bars[i].amplitude = 0;
                if (phaseBars[i]) phaseBars[i].phase = 0;
            }
            dragging = null;
            draggingType = null;
            console.log('Componentes reiniciados (A0-A11)');
        });
    }
};

function loadExampleComponents(ampValues, phaseValues = []) {
    // Cargar componentes A1-A11 desde los ejemplos, A0 se mantiene si no se especifica
    for (let i = 1; i < components.length; i++) {
        components[i].amp = ampValues[i-1] || 0;
        components[i].phase = phaseValues[i-1] || 0;

        // Actualizar barras visuales
        if (bars[i]) bars[i].amplitude = components[i].amp;
        if (phaseBars[i]) phaseBars[i].phase = components[i].phase;
    }
    console.log("Ejemplo cargado - A0 se mantiene como esté (editable):", components[0]);
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