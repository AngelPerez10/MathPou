var matriz = [[0, 0, 0]];  // Siempre comienza con [0,0]
let amplitudes, phases, time, signal;
let minX, maxX, minY, maxY;

// Función para actualizar la matriz con los valores actuales
function actualizarMatriz() {
    matriz = [[0, 0, 0]];  // Reinicia la matriz con [0,0,0]
    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');
    var periodo = parseFloat(document.querySelector('.periodo').value);  // Obtiene el único periodo

    for (var i = 0; i < inputsAmplitud.length; i++) {
        matriz.push([parseFloat(inputsAmplitud[i].value), parseFloat(inputsTiempo[i].value), periodo]);
    }
    console.log("Matriz actualizada:", matriz);  // Para depurar
}


document.getElementById('clear').addEventListener('click', function() {
    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');

    inputsAmplitud.forEach(input => {
        input.value = '';
    });

    inputsTiempo.forEach(input => {
        input.value = '';
    });

    matriz = [[0, 0]];
    console.log("Matriz después de limpiar:", matriz);
    cleargrafic();
});

function cleargrafic(){
    background(255);
}

document.getElementById('crear').addEventListener('click', function() {
    var container = document.getElementById('inputs-container');
    var numInputs = container.querySelectorAll('input[type="number"]').length / 2;

    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');
    for (var i = 0; i < inputsAmplitud.length; i++) {
        if (inputsAmplitud[i].value.trim() === '' || inputsTiempo[i].value.trim() === '') {
            alert("Por favor, llene todos los campos antes de crear nuevos inputs.");
            return;
        }
    }

    if (numInputs >= 3) {
        alert("Se ha alcanzado el límite de 3 conjuntos de campos de entrada.");
        return;
    }

    var nuevaAmplitud = document.createElement('div');
    nuevaAmplitud.classList.add('inputs_charts_Amplietudes');
    nuevaAmplitud.innerHTML = `<label for="amplitud${numInputs + 1}">Amplitud ${numInputs + 1}:</label><input type="number" name="amplitud${numInputs + 1}" class="amplitud">`;

    var nuevoTiempo = document.createElement('div');
    nuevoTiempo.classList.add('inputs_charts_Tiempos');
    nuevoTiempo.innerHTML = `<label for="tiempo${numInputs + 1}">Tiempo ${numInputs + 1}:</label><input type="number" name="tiempo${numInputs + 1}" class="tiempo">`;

    container.insertBefore(nuevaAmplitud, container.lastElementChild);
    container.insertBefore(nuevoTiempo, container.lastElementChild);

    actualizarMatriz();  // Actualiza la matriz después de crear los nuevos inputs
});

document.getElementById('btn_generar').addEventListener('click', function() {
    actualizarMatriz();
    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');
    for (var i = 0; i < inputsAmplitud.length; i++) {
        if (inputsAmplitud[i].value.trim() === '' || inputsTiempo[i].value.trim() === '') {
            alert("Por favor, llenar los campos para generar grafica.");
            return;
        }
    }
    fetch('/calculate_signal_of_prueba_grafica/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ datos: matriz })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.signal) {
            amplitudes = data.amplitudes;
            phases = data.phases;
            time = data.time;
            signal = data.signal;

            minX = Math.min(...time);
            maxX = Math.max(...time);
            minY = Math.min(...signal);
            maxY = Math.max(...signal);

            drawGraph();
        } else {
            console.error('No se recibió una señal en la respuesta.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    console.log("Botón de generar presionado:", matriz);
});

function setup() {
    createCanvas(800, 400).parent('plot-container');
}

function drawGraph() {
    background(255);
    noFill();
    strokeWeight(2);

    beginShape();
    for (let i = 0; i < signal.length; i++) {
        let x = map(time[i], minX, maxX, 60, width - 60);
        let y = map(signal[i], minY, maxY, height - 60, 60);
        
        stroke('black');
        vertex(x, y);
    }
    endShape();
   
    drawAxes();
}

function drawAxes() {
    let axisColor = '#000';
    let numMarksX = 10;
    let numMarksY = 10;

    stroke(axisColor);
    strokeWeight(2);
    line(60, height - 60, width - 60, height - 60);
    line(60, 60, 60, height - 60);

    textAlign(CENTER, CENTER);
    for (let i = 0; i <= numMarksX; i++) {
        let value = map(i, 0, numMarksX, minX, maxX);
        let x = map(value, minX, maxX, 60, width - 60);
        strokeWeight(1);
        line(x, height - 65, x, height - 55);
        noStroke();
        fill(axisColor);
        text(value.toFixed(1), x, height - 30);
    }

    for (let i = 0; i <= numMarksY; i++) {
        let value = map(i, 0, numMarksY, minY, maxY);
        let y = map(value, minY, maxY, height - 60, 60);
        strokeWeight(1);
        line(55, y, 65, y);
        noStroke();
        fill(axisColor);
        text(value.toFixed(1), 25, y);
    }
}


function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
}