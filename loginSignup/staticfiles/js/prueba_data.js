// Variables globales
var matriz = [[0, 0]];  // Siempre comienza con [0,0]
let amplitudes, phases, time, signal;
let minX, maxX, minY, maxY;

// Función para actualizar la matriz con los valores actuales
function actualizarMatriz() {
    matriz = [[0, 0]];  // Reinicia la matriz con [0,0]
    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');

    for (var i = 0; i < inputsAmplitud.length; i++) {
        // Solo agregar si ambos valores están presentes
        if (inputsAmplitud[i].value && inputsTiempo[i].value) {
            matriz.push([parseFloat(inputsAmplitud[i].value), parseFloat(inputsTiempo[i].value)]);
        }
    }
    console.log("Matriz actualizada:", matriz);  // Para depurar
}

// Función para limpiar todos los inputs
document.getElementById('clear').addEventListener('click', function () {
    var inputsList = document.getElementById('inputs-list');
    
    // Mantener solo los dos inputs originales
    var inputGroups = inputsList.querySelectorAll('.input-group');
    for (let i = 2; i < inputGroups.length; i++) {
        inputsList.removeChild(inputGroups[i]);
    }
    
    // Limpiar valores de los inputs originales
    document.getElementById('amplitud-input').value = '';
    document.getElementById('tiempo-input').value = '';
    
    matriz = [[0, 0]];
    console.log("Matriz después de limpiar:", matriz);
    cleargrafic();

    // Restaurar etiquetas iniciales
    document.querySelector('#inputs-list .input-group:first-child label').innerHTML = `
        <i class="uil uil-chart-growth"></i>
        Amplitud A<sub>1</sub>:
    `;
    document.querySelector('#inputs-list .input-group:nth-child(2) label').innerHTML = `
        <i class="uil uil-clock"></i>
        Tiempo t<sub>0</sub>:
    `;

    // Limpiar tabla de resultados
    document.getElementById('matriz-data').innerHTML = `
        <tr>
            <td colspan="3" style="text-align: center; padding: 20px; color: #6c757d;">
                <i class="uil uil-exclamation-triangle"></i> No hay datos disponibles. Ingrese valores y haga clic en "Crear".
            </td>
        </tr>
    `;
    
    // Restablecer el gráfico
    const plotContainer = document.getElementById('plot-container');
    plotContainer.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'plot-placeholder';
    placeholder.innerHTML = `
        <i class="uil uil-image-plus"></i>
        <p>La gráfica se generará aquí después de ingresar los datos</p>
    `;
    plotContainer.appendChild(placeholder);
});

// Función para crear nuevos inputs
document.getElementById('crear').addEventListener('click', function () {
    var inputsList = document.getElementById('inputs-list');
    var numInputs = inputsList.querySelectorAll('.input-group').length / 2;

    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');

    // Validar que no haya campos vacíos
    for (var i = 0; i < inputsAmplitud.length; i++) {
        if (inputsAmplitud[i].value.trim() === '' || inputsTiempo[i].value.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, llene todos los campos antes de crear nuevos.',
                confirmButtonColor: '#4A6CF7',
                confirmButtonText: 'Entendido'
            });
            return;
        }
    }

    // Validar límite de pulsos
    if (numInputs >= 10) {
        Swal.fire({
            icon: 'info',
            title: 'Límite alcanzado',
            text: 'Se ha alcanzado el límite de 10 conjuntos de campos de entrada.',
            confirmButtonColor: '#4A6CF7',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Crear nuevo campo de amplitud con las clases correctas
    var nuevaAmplitud = document.createElement('div');
    nuevaAmplitud.classList.add('input-group');
    nuevaAmplitud.innerHTML = `
        <label for="amplitud${numInputs+1}">
            <i class="uil uil-chart-growth"></i>
            Amplitud A<sub>${numInputs+1}</sub>:
        </label>
        <input type="number" name="amplitud${numInputs+1}" class="amplitud" placeholder="Ingrese valor">
    `;

    // Crear nuevo campo de tiempo con las clases correctas
    var nuevoTiempo = document.createElement('div');
    nuevoTiempo.classList.add('input-group');
    nuevoTiempo.innerHTML = `
        <label for="tiempo${numInputs}">
            <i class="uil uil-clock"></i>
            Tiempo t<sub>${numInputs}</sub>:
        </label>
        <input type="number" name="tiempo${numInputs}" class="tiempo" placeholder="Ingrese valor">
    `;

    // Agregar inputs al contenedor
    inputsList.appendChild(nuevaAmplitud);
    inputsList.appendChild(nuevoTiempo);

    // Actualizar matriz
    actualizarMatriz();
    
    // Mostrar mensaje de éxito
    Swal.fire({
        icon: 'success',
        title: 'Nuevos campos añadidos',
        text: `Ahora puede ingresar los valores para el pulso ${numInputs+1}`,
        confirmButtonColor: '#4A6CF7',
        timer: 2000
    });
});

// Función para generar la gráfica
document.getElementById('btn_generar').addEventListener('click', function () {
    actualizarMatriz();
    var inputsAmplitud = document.querySelectorAll('.amplitud');
    var inputsTiempo = document.querySelectorAll('.tiempo');

    // Validar que todos los campos estén llenos
    for (var i = 0; i < inputsAmplitud.length; i++) {
        if (inputsAmplitud[i].value.trim() === '' || inputsTiempo[i].value.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, complete todos los campos antes de generar la gráfica.',
                confirmButtonColor: '#4A6CF7',
                confirmButtonText: 'Entendido'
            });
            return;
        }
    }

    // Validar que haya al menos un pulso definido
    if (matriz.length <= 1) {
        Swal.fire({
            icon: 'error',
            title: 'Datos insuficientes',
            text: 'Debe crear al menos un pulso con valores válidos.',
            confirmButtonColor: '#4A6CF7',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Mostrar carga
    Swal.fire({
        title: 'Procesando datos',
        text: 'Calculando la transformada de Fourier...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

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
        Swal.close();
        
        if (data.signal) {
            amplitudes = data.amplitudes;
            phases = data.phases;
            time = data.time;
            signal = data.signal;
            const T = data.T;
            const w0 = data.w0;

            minX = Math.min(...time);
            maxX = Math.max(...time);
            minY = Math.min(...signal);
            maxY = Math.max(...signal);

            // Ajustar para mejor visualización
            if (minY > 0) minY = 0;
            maxY = maxY * 1.1; // Agregar margen

            drawGraph();
            displayMatrixData(matriz, T, w0);
            
            Swal.fire({
                icon: 'success',
                title: '¡Gráfica generada!',
                text: 'La visualización se ha creado correctamente.',
                confirmButtonColor: '#4A6CF7',
                timer: 2000
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'No se recibió una señal en la respuesta.',
                confirmButtonColor: '#4A6CF7',
                confirmButtonText: 'Revisar'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'Hubo un problema al intentar procesar los datos.',
            footer: `<p>Detalles: ${error.message}</p>`,
            confirmButtonColor: '#4A6CF7',
            confirmButtonText: 'Entendido'
        });
    });
});

// Función para mostrar los datos de la matriz, T y w0 en el contenedor
function displayMatrixData(matriz, T, w0) {
    const matrizContainer = document.getElementById('matriz-data');

    // Calcular duraciones
    let duraciones = [];
    for (let i = 1; i < matriz.length; i++) {
        duraciones.push(matriz[i][1] - matriz[i - 1][1]);
    }

    // Crear tabla con pulsos, amplitudes y duraciones (numeración desde 1)
    let numPulsos = matriz.length - 1;
    let tablaHtml = '';

    for (let i = 0; i < numPulsos; i++) {
        tablaHtml += `
            <tr>
                <td>Pulso ${i+1}</td>
                <td>A<sub>${i+1}</sub> = ${matriz[i + 1][0]}</td>
                <td>${duraciones[i].toFixed(2)} (t<sub>${i+1}</sub> - t<sub>${i}</sub>)</td>
            </tr>
        `;
    }

    // Mostrar la tabla y datos adicionales
    matrizContainer.innerHTML = `
        <tr>
            <th>Pulso</th>
            <th>Amplitud</th>
            <th>Duración</th>
        </tr>
        ${tablaHtml}
        <tr>
            <td colspan="3" style="text-align: left; padding: 15px; background-color: #f8f9fa;">
                <strong>Función de ${numPulsos} pulsos</strong><br>
                <strong>Periodo (T):</strong> ${T.toFixed(4)}<br>
                <strong>Frecuencia angular (ω₀):</strong> ${w0.toFixed(4)}
            </td>
        </tr>
    `;
}

// Funciones de gráficos con p5.js
function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent('plot-container');
    background(255);
    
    // Dibujar placeholder inicial
    drawPlaceholder();
}

function drawPlaceholder() {
    background(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    fill(108, 117, 125);
    noStroke();
    text("La gráfica se generará aquí después de ingresar los datos", width/2, height/2);
}

function cleargrafic() {
    background(255);
    drawPlaceholder();
}

function drawGraph() {
    background(255);
    
    // Dibujar ejes
    drawAxes();
    
    // Dibujar gráfica
    noFill();
    stroke(74, 108, 247);
    strokeWeight(2);
    
    beginShape();
    for (let i = 0; i < signal.length; i++) {
        let x = map(time[i], minX, maxX, 60, width - 60);
        let y = map(signal[i], minY, maxY, height - 60, 60);
        vertex(x, y);
    }
    endShape();
}

function drawAxes() {
    let axisColor = '#000';
    let numMarksX = 10;
    let numMarksY = 10;

    stroke(axisColor);
    strokeWeight(2);
    
    // Eje X
    line(60, height - 60, width - 60, height - 60);
    
    // Eje Y
    line(60, 60, 60, height - 60);

    // Marcas en el eje X
    textSize(12);
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

    // Marcas en el eje Y
    for (let i = 0; i <= numMarksY; i++) {
        let value = map(i, 0, numMarksY, minY, maxY);
        let y = map(value, minY, maxY, height - 60, 60);
        strokeWeight(1);
        line(55, y, 65, y);
        noStroke();
        fill(axisColor);
        text(value.toFixed(1), 25, y);
    }
    
    // Etiquetas de ejes
    textSize(14);
    text("Tiempo", width / 2, height - 15);
    push();
    translate(20, height / 2);
    rotate(-HALF_PI);
    text("Amplitud", 0, 0);
    pop();
}

// Función para obtener el token CSRF
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

// Inicializar p5.js cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Asegurarse de que p5.js se inicialice correctamente
    if (typeof setup === 'function') {
        setup();
    }
});