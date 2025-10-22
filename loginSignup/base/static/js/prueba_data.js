// Variables globales
var matriz = [[0, 0]];  // Siempre comienza con [0,0]
let amplitudes, phases, time, signal;
let reconTime = null, reconSignal = null; // Reconstrucción Fourier
let renderMode = 'step'; // 'step' para vista previa por pulsos, 'line' para reconstrucción con fórmulas
let minX, maxX, minY, maxY;

// Función para actualizar la matriz con los valores actuales en orden t0, a1, t1, a2, t2...
function actualizarMatriz() {
    var inputsList = document.getElementById('inputs-list');
    var inputGroups = inputsList.querySelectorAll('.input-group');

    console.log("Número de grupos de input:", inputGroups.length);
    console.log("Grupos encontrados (t0, a1, t1, ...):");
    for (let i = 0; i < inputGroups.length; i++) {
        const ampInput = inputGroups[i].querySelector('.amplitud');
        const timeInput = inputGroups[i].querySelector('.tiempo');
        console.log(`Grupo ${i}: amp=${ampInput?.value || 'null'}, time=${timeInput?.value || 'null'}`);
    }

    // t0 debe estar en el primer grupo (tiempo inicial)
    const firstTimeInput = inputGroups[0]?.querySelector('.tiempo');
    let t0 = null;
    if (firstTimeInput && firstTimeInput.value.trim() !== '') {
        const t0Val = parseFloat(firstTimeInput.value);
        if (!isNaN(t0Val)) t0 = t0Val;
    }

    // Si t0 válido, iniciar matriz con [0, t0], de lo contrario con [0, 0]
    matriz = [[0, isFinite(t0) ? t0 : 0]];

    // Leer pares a partir del índice 1: alternando amplitud y tiempo
    let currentAmp = null;
    for (let i = 1; i < inputGroups.length; i++) {
        const ampInput = inputGroups[i].querySelector('.amplitud');
        const timeInput = inputGroups[i].querySelector('.tiempo');

        if (ampInput) {
            const aVal = parseFloat(ampInput.value);
            if (!isNaN(aVal) || ampInput.value.trim() === '0') {
                currentAmp = aVal;
            }
        } else if (timeInput) {
            const tVal = parseFloat(timeInput.value);
            if (currentAmp !== null && !isNaN(tVal)) {
                matriz.push([currentAmp, tVal]);
                console.log(`Punto agregado: [${currentAmp}, ${tVal}]`);
                currentAmp = null;
            }
        }
    }

    console.log("Matriz final:", matriz);
    cleargrafic();
}

// Función para limpiar todos los inputs y reestablecer estado para poder generar de nuevo
document.getElementById('btn_clear').addEventListener('click', function () {
    var inputsList = document.getElementById('inputs-list');

    // Mantener solo los tres inputs originales (t0, A1, t1)
    var inputGroups = inputsList.querySelectorAll('.input-group');
    for (let i = 3; i < inputGroups.length; i++) {
        inputsList.removeChild(inputGroups[i]);
    }

    // Limpiar valores de los inputs originales (t0, A1, t1)
    document.getElementById('tiempo-input').value = '';
    document.getElementById('amplitud-input').value = '';
    document.getElementById('tiempo1-input').value = '';

    // Limpiar tabla
    var tablaBody = document.getElementById('tabla-body');
    if (tablaBody) tablaBody.innerHTML = '';

    // Reiniciar estado interno de la gráfica
    matriz = [[0, 0]];
    time = [];
    signal = [];
    reconTime = null;
    reconSignal = null;
    minX = undefined; maxX = undefined; minY = undefined; maxY = undefined;
    renderMode = 'step';

    // Rehabilitar botones por si quedaron deshabilitados
    const btnCrear = document.getElementById('crear');
    const btnGenerar = document.getElementById('btn_generar');
    if (btnCrear) btnCrear.disabled = false;
    if (btnGenerar) btnGenerar.disabled = false;

    console.log('Formulario y estado reiniciados. Listo para generar otra gráfica.');

    // Redibujar placeholder en el canvas
    if (typeof drawPlaceholder === 'function') {
        drawPlaceholder();
    }

    // Restaurar etiquetas iniciales (t0, A1, t1)
    document.querySelector('#inputs-list .input-group:first-child label').innerHTML = `
        <i class="uil uil-clock"></i>
        Tiempo t<sub>0</sub>:
    `;
    document.querySelector('#inputs-list .input-group:nth-child(2) label').innerHTML = `
        <i class="uil uil-chart-growth"></i>
        Amplitud 1:
    `;
    const thirdLabel = document.querySelector('#inputs-list .input-group:nth-child(3) label');
    if (thirdLabel) {
        thirdLabel.innerHTML = `
            <i class="uil uil-clock"></i>
            Tiempo t<sub>1</sub>:
        `;
    }

    // Limpiar tabla de resultados
    document.getElementById('matriz-data').innerHTML = `
        <tr>
            <td colspan="3" style="text-align: center; padding: 20px; color: #6c757d;">
                <i class="uil uil-exclamation-triangle"></i> No hay datos disponibles. Ingrese valores y haga clic en "Crear".
            </td>
        </tr>
    `;

    // Restablecer el gráfico en el canvas existente (no eliminar el canvas)
    cleargrafic();
});

// Función para crear nuevos inputs siguiendo el patrón t0, a1, t1, a2, t2... (añade tN y A_{N+1} por clic)
document.getElementById('crear').addEventListener('click', function () {
    var inputsList = document.getElementById('inputs-list');
    var inputGroups = inputsList.querySelectorAll('.input-group');

    // Validar que no haya campos vacíos en los existentes
    for (var i = 0; i < inputGroups.length; i++) {
        var anyInput = inputGroups[i].querySelector('input');
        if (!anyInput || anyInput.value.trim() === '') {
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

    // Calcular índices próximos
    const totalTimes = inputsList.querySelectorAll('.tiempo').length; // incluye t0
    const totalAmps = inputsList.querySelectorAll('.amplitud').length; // A1, A2, ...

    // Límite de pulsos (10) => máximo A_k es 10
    if (totalAmps >= 10) {
        Swal.fire({
            icon: 'info',
            title: 'Límite alcanzado',
            text: 'Se ha alcanzado el límite de 10 pulsos.',
            confirmButtonColor: '#4A6CF7',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Por cada clic, agregar ambos: primero A_{totalAmps+1}, luego t_{totalTimes}
    const nextAmpNum = totalAmps + 1;
    var nuevaAmplitud = document.createElement('div');
    nuevaAmplitud.classList.add('input-group');
    nuevaAmplitud.innerHTML = `
        <label for="amplitud${nextAmpNum}">
            <i class=\"uil uil-chart-growth\"></i>
            Amplitud ${nextAmpNum}:
        </label>
        <input type=\"number\" name=\"amplitud${nextAmpNum}\" class=\"amplitud\" placeholder=\"Ingrese valor\" step=\"0.1\">
    `;
    inputsList.appendChild(nuevaAmplitud);

    var nuevoTiempo = document.createElement('div');
    nuevoTiempo.classList.add('input-group');
    nuevoTiempo.innerHTML = `
        <label for="tiempo${totalTimes}">
            <i class=\"uil uil-clock\"></i>
            Tiempo t<sub>${totalTimes}</sub>:
        </label>
        <input type=\"number\" name=\"tiempo${totalTimes}\" class=\"tiempo\" placeholder=\"Ingrese valor (puede ser 0)\" min=\"0\" step=\"0.1\">
    `;
    inputsList.appendChild(nuevoTiempo);

    // Actualizar matriz tras añadir
    actualizarMatriz();

    Swal.fire({
        icon: 'success',
        title: 'Campo añadido',
        text: 'Se agregó un nuevo campo siguiendo el patrón t0, a1, t1, ...',
        confirmButtonColor: '#4A6CF7',
        timer: 1500
    });
});

// Función CORREGIDA para construir señal local
function buildLocalSignal(points, samples = 500) {
    if (!points || points.length === 0) {
        return { time: [0, 1], signal: [0, 0] };
    }

    // Mantener el orden de ingreso (no ordenar) para respetar t0 y empates
    points = points.slice();

    // Construir segmentos explícitos [start, end, amp]
    // Entrada: [[0,t0],[A1,t1],[A2,t2],...]
    // Regla (Fourier por tramos): cada A_k aplica en [t_{k-1}, t_k).
    // Si t_k == t_{k-1}, el tramo es de ancho cero y se omite.
    const times = points.map(p => p[1]); // t0, t1, t2, ...
    const amps = points.slice(1).map(p => p[0]); // A1, A2, ...
    const segments = [];
    for (let k = 1; k < points.length; k++) { // k indexa A_k y t_k
        const start = times[k - 1];
        const end = times[k];
        if (end > start) {
            segments.push({ start, end, amp: amps[k - 1] });
        }
    }
    const tLast = times[times.length - 1];

    // Determinar rango de tiempo
    let minT = Math.min(...times);
    let maxT = tLast;

    // Extender el rango para mejor visualización
    const timeRange = maxT - minT;
    if (timeRange < 1e-9) {
        minT -= 1;
        maxT += 1;
    } else {
        const firstPointTime = Math.min(...times);
        // No forzar incluir 0; mostrar margen a la izquierda de t0
        minT = firstPointTime - timeRange * 0.1;
        maxT += timeRange * 0.5;
    }

    // Asegurar que el rango máximo sea al menos hasta el valor más alto
    if (maxT < tLast + 2) {
        maxT = tLast + 2;
    }

    const tArr = [];
    const sArr = [];

    // Generar puntos de la señal
    for (let i = 0; i < samples; i++) {
        const t = minT + (maxT - minT) * (i / (samples - 1));
        tArr.push(t);

        // Determinar la amplitud en el tiempo t según segmentos [start,end)
        let amplitude = 0;
        for (let s = 0; s < segments.length; s++) {
            const seg = segments[s];
            if (t >= seg.start && t < seg.end) { amplitude = seg.amp; break; }
        }

        sArr.push(amplitude);
    }

    console.log('Señal construida:', {
        puntosEntrada: points,
        rangoTiempo: [minT, maxT],
        valoresSeñal: sArr.filter((val, idx, arr) => val !== arr[idx-1]), // Valores únicos
        primeros10Valores: sArr.slice(0, 10),
        amplitudEnT0: sArr[0], // Amplitud en el primer punto de tiempo
        amplitudEnT2: sArr.find((val, idx) => tArr[idx] >= 2), // Amplitud cuando t >= 2
        puntosTiempo: tArr.filter((t, idx) => t <= 2).length // Número de puntos hasta t = 2
    });

    return { time: tArr, signal: sArr };
}

// Repetir señal: duplica el patrón en el tiempo 'repeats' veces usando el periodo T
function repeatSignal(timeArr, signalArr, T, repeats = 2, gapRatio = 0) {
    if (!Array.isArray(timeArr) || !Array.isArray(signalArr) || timeArr.length !== signalArr.length) {
        return { time: timeArr, signal: signalArr };
    }
    if (!isFinite(T) || T <= 0) {
        return { time: timeArr, signal: signalArr };
    }
    // Construir patrón base e insertar caída a 0 al final del periodo
    const outTime = timeArr.slice();
    const outSignal = signalArr.slice();
    const baseTime = timeArr.slice();
    const baseSignal = signalArr.slice();
    const lastIdx = baseSignal.length - 1;
    if (lastIdx >= 0 && baseSignal[lastIdx] !== 0) {
        baseTime.push(baseTime[lastIdx]);
        baseSignal.push(0);
        outTime.push(timeArr[lastIdx]);
        outSignal.push(0);
    }
    // Añadir un espacio (horizontal en 0) tras el fin del primer periodo si gapRatio > 0
    const gap = Math.max(0, gapRatio * T);
    if (gap > 0 && lastIdx >= 0) {
        outTime.push(timeArr[lastIdx] + gap);
        outSignal.push(0);
    }
    const baseLen = baseTime.length;
    for (let r = 1; r <= repeats; r++) {
        const offset = r * (T + gap);
        for (let i = 0; i < baseLen; i++) {
            outTime.push(baseTime[i] + offset);
            outSignal.push(baseSignal[i]);
        }
    }
    return { time: outTime, signal: outSignal };
}

// Tiled repetition in both directions without forcing zeros; supports gaps via gapRatio (ensure global)
if (typeof window !== 'undefined' && typeof window.tileSignal !== 'function') {
    window.tileSignal = function(timeArr, signalArr, T, repeatsBefore = 0, repeatsAfter = 2, gapRatio = 0) {
        if (!Array.isArray(timeArr) || !Array.isArray(signalArr) || timeArr.length !== signalArr.length) {
            return { time: timeArr, signal: signalArr };
        }
        if (!isFinite(T) || T <= 0) {
            return { time: timeArr, signal: signalArr };
        }
        const gap = Math.max(0, gapRatio * T);
        const baseTime = timeArr.slice();
        const baseSignal = signalArr.slice();

        const outTime = [];
        const outSignal = [];

        // Backward tiles
        for (let r = repeatsBefore; r >= 1; r--) {
            const offset = -r * (T + gap);
            for (let i = 0; i < baseTime.length; i++) {
                outTime.push(baseTime[i] + offset);
                outSignal.push(baseSignal[i]);
            }
        }

        // Base tile
        for (let i = 0; i < baseTime.length; i++) {
            outTime.push(baseTime[i]);
            outSignal.push(baseSignal[i]);
        }

        // Forward tiles
        for (let r = 1; r <= repeatsAfter; r++) {
            const offset = r * (T + gap);
            for (let i = 0; i < baseTime.length; i++) {
                outTime.push(baseTime[i] + offset);
                outSignal.push(baseSignal[i]);
            }
        }

        return { time: outTime, signal: outSignal };
    };
}

// Función para dibujar vista previa
function drawPreviewAndAdjust(timeArr, signalArr) {
    if (!timeArr || !signalArr || timeArr.length === 0) return;

    time = timeArr;
    signal = signalArr;

    minX = Math.min(...time);
    maxX = Math.max(...time);
    minY = Math.min(...signal);
    maxY = Math.max(...signal);

    // Evitar rangos degenerados y fijar el inicio en el primer tiempo (sin margen negativo)
    if (Math.abs(maxX - minX) < 1e-6) {
        minX -= 0.5;
        maxX += 0.5;
    } else {
        const origMin = Math.min(...time);
        const origMax = Math.max(...time);
        const range = (origMax - origMin) || 1;
        // Fijar inicio exacto en el primer tiempo (respeta t0), sin padding a la izquierda
        minX = origMin;
        // Pequeño margen sólo a la derecha para que no corte el último segmento
        maxX = origMax + range * 0.05;
    }
    if (Math.abs(maxY - minY) < 1e-6) {
        minY -= 1;
        maxY += 1;
    }

    // Asegurar que el rango máximo de tiempo llegue al menos hasta el valor más alto
    if (maxX < Math.max(...time)) {
        maxX = Math.max(...time);
    }

    // Ajustes para mejor visualización - asegurar que llegue al valor máximo
    if (minY > 0) minY = 0;
    // Redondear maxY hacia arriba para asegurar que llegue al valor máximo deseado
    maxY = Math.ceil(maxY * 1.5); // Aumenté aún más para garantizar llegar al valor máximo

    // Asegurar que el rango máximo de amplitud llegue al menos hasta el valor más alto
    const maxAmplitude = Math.max(...signal);
    if (maxY < maxAmplitude + 2) {
        maxY = Math.ceil(maxAmplitude + 2);
    }

    console.log('Rangos de vista previa -> minX,maxX,minY,maxY:', minX, maxX, minY, maxY);
    drawGraph();
}

// Función para generar la gráfica
document.getElementById('btn_generar').addEventListener('click', function () {
    actualizarMatriz();

    // Validar que haya al menos un pulso definido (t0 + al menos a1,t1)
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

    // Validar que todos los inputs estén llenos y que después de t0 haya pares completos (a,t)
    var inputGroups = document.getElementById('inputs-list').querySelectorAll('.input-group');
    for (var i = 0; i < inputGroups.length; i++) {
        var anyInput = inputGroups[i].querySelector('input');
        if (!anyInput || anyInput.value.trim() === '') {
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
    // cantidad de grupos después de t0 debe ser par (a1,t1, a2,t2, ...)
    if (((inputGroups.length - 1) % 2) !== 0) {
        Swal.fire({
            icon: 'error',
            title: 'Secuencia incompleta',
            text: 'La secuencia debe ser t0, a1, t1, a2, t2, ...',
            confirmButtonColor: '#4A6CF7'
        });
        return;
    }

    // Validar que los tiempos sean no-decrecientes con respecto a t0 y entre sí
    for (let i = 1; i < matriz.length; i++) {
        console.log(`Comparando t${i} (${matriz[i][1]}) con t${i-1} (${matriz[i-1][1]})`);
        if (matriz[i][1] < matriz[i-1][1]) {
            Swal.fire({
                icon: 'error',
                title: 'Tiempos inválidos',
                text: `El tiempo t${i} (${matriz[i][1]}) debe ser mayor o igual que t${i-1} (${matriz[i-1][1]})`,
                confirmButtonColor: '#4A6CF7'
            });
            return;
        }
    }

    console.log('Validación de tiempos pasada correctamente');

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

    // Log payload para depuración
    console.log('Matriz (UI):', matriz);

    // Construir payload a partir de los inputs reales (ignorar el elemento inicial [*, t0])
    let userPoints = matriz.slice(1).map(p => ({ amp: p[0], t: p[1] }));

    if (userPoints.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Datos insuficientes',
            text: 'No hay puntos definidos para enviar.',
            confirmButtonColor: '#4A6CF7'
        });
        Swal.close();
        return;
    }

    console.log('userPoints construidos:', userPoints);
    // Desactivar overlay de Fourier para esta ejecución
    reconTime = null;
    reconSignal = null;

    // Respetar el orden ingresado por el usuario (no ordenar automáticamente)
    console.log('Datos finales a enviar (orden ingresado):', userPoints);

    // Convertir de nuevo a formato [[amp, t], ...] para enviar
    const payloadDatos = userPoints.map(p => [p.amp, p.t]);
    console.log('Payload enviado al servidor:', payloadDatos);
    console.log('Datos específicos - A0:', payloadDatos[0]?.[0], 't0:', payloadDatos[0]?.[1]);
    console.log('Datos específicos - A1:', payloadDatos[1]?.[0], 't1:', payloadDatos[1]?.[1]);

    // --- Generar vista previa local inmediatamente ---
    try {
        // Construir segmentos base exactos a partir de matriz (sin muestreo), con opción de envoltura si t1==t0
        const times = matriz.map(p => Number(p[1])); // t0, t1, t2, ...
        const amps = matriz.slice(1).map(p => Number(p[0])); // A1, A2, ...
        const t0ui = times[0];
        const tLast = times[times.length - 1];
        const segments = [];
        // Envoltura si hay empate t1==t0 y existe siguiente tiempo mayor
        if (times.length >= 3 && times[1] === times[0] && times[2] > times[1]) {
            segments.push({ start: times[0] - (times[2] - times[1]), end: times[0], amp: amps[0] });
        }
        // Tramos estándar [t_{k-1}, t_k)
        for (let k = 1; k < times.length; k++) {
            if (times[k] > times[k - 1]) {
                segments.push({ start: times[k - 1], end: times[k], amp: amps[k - 1] });
            }
        }
        // Construir arrays base exactos (puntos de borde y horizontales)
        let baseTime = [], baseSignal = [];
        for (const seg of segments) {
            // Borde de inicio del segmento
            baseTime.push(seg.start);
            baseSignal.push(seg.amp);
            // Mantener horizontal hasta el final
            baseTime.push(seg.end);
            baseSignal.push(seg.amp);
        }
        // Forzar nivel 0 al inicio y fin del periodo para separar visualmente los periodos
        if (baseTime.length === 0 || baseTime[0] > t0ui) {
            baseTime.unshift(t0ui);
            baseSignal.unshift(0);
        }
        if (baseTime[baseTime.length - 1] < tLast) {
            baseTime.push(tLast);
            baseSignal.push(0);
        }
        const Tbase = tLast - t0ui;
        let toDraw = { time: baseTime, signal: baseSignal };
        if (isFinite(Tbase) && Tbase > 0) {
            // Mostrar a partir de t0 hacia adelante solamente (sin periodos antes de t0)
            toDraw = (window.tileSignal || function(t, s){return {time:t, signal:s};})(baseTime, baseSignal, Tbase, 0, 3, 1);
        }
        console.log('Vista previa generada (tiling -1T..+2T):', toDraw);
        renderMode = 'step';
        drawPreviewAndAdjust(toDraw.time, toDraw.signal);
    } catch (e) {
        console.error('Error construyendo vista previa:', e);
    }

    // Enviar datos al servidor
    fetch('/calculate_signal_of_prueba_grafica/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ datos: payloadDatos })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        Swal.close();

        if (data.signal) {
            console.log('Server time (len):', data.time ? data.time.length : 0, 'signal (len):', data.signal ? data.signal.length : 0);
            console.log('First 10 time:', (data.time || []).slice(0,10));
            console.log('First 10 signal:', (data.signal || []).slice(0,10));
            console.log('Datos específicos del servidor - A0:', (data.signal || [])[0], 't0:', (data.time || [])[0]);
            console.log('Transición en servidor - buscar cambio de 5 a 2');

            // Buscar el punto donde cambia de 5 a 2
            let transitionIndex = -1;
            for (let i = 1; i < (data.signal || []).length; i++) {
                if ((data.signal || [])[i-1] === 5 && (data.signal || [])[i] === 2) {
                    transitionIndex = i;
                    console.log('Transición encontrada en índice:', i, 'tiempo:', (data.time || [])[i]);
                    break;
                }
            }
            if (transitionIndex === -1) {
                console.log('No se encontró transición de 5 a 2. Valores únicos:', [...new Set(data.signal || [])]);
            }

            amplitudes = data.amplitudes;
            phases = data.phases;
            const T = data.T;
            const w0 = data.w0;

            // Usar la señal del servidor (más precisa que la vista previa local)
            console.log('Usando señal del servidor en lugar de la vista previa');
            console.log('Datos del servidor - T:', T, 'w0:', w0);
            console.log('Rangos del servidor - time:', Math.min(...time), Math.max(...time));
            console.log('Rangos del servidor - signal:', Math.min(...signal), Math.max(...signal));
            console.log('Primeros 10 valores del servidor:', (data.signal || []).slice(0,10));
            console.log('Amplitud inicial del servidor:', (data.signal || [])[0]);

            // Mantener solo la previsualización local (sin overlay azul)
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
        console.error('Fetch error:', error);
    });
});

// Función para mostrar los datos de la matriz, T y w0 en el contenedor
function displayMatrixData(matriz, T, w0) {
    const matrizContainer = document.getElementById('matriz-data');

    // Calcular duraciones correctamente
    let duraciones = [];
    for (let i = 1; i < matriz.length; i++) {
        duraciones.push(matriz[i][1] - matriz[i - 1][1]);
    }

    console.log('Duraciones calculadas:', duraciones);
    console.log('Matriz de puntos:', matriz);

    // Crear tabla con pulsos, amplitudes y duraciones (numeración desde 1)
    let numPulsos = matriz.length - 1;
    let tablaHtml = '';

    for (let i = 1; i < matriz.length; i++) {
        tablaHtml += `
            <tr>
                <td>Pulso ${i}</td>
                <td>A<sub>${i}</sub> = ${matriz[i][0]}</td>
                <td>${duraciones[i-1].toFixed(2)} (t<sub>${i}</sub> - t<sub>${i-1}</sub>)</td>
            </tr>
        `;
    }

    // Mostrar la tabla y datos adicionales
    matrizContainer.innerHTML = `
        <tr>
            <th>Pulso</th>
            <th>Amplitud</th>
            <th>Ancho o duración</th>
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

    // Dibujar gráfica como escalera (step plot): tramos horizontales y saltos verticales
    stroke(255, 165, 0); // naranja para Original
    strokeWeight(3);
    noFill();

    if (signal && time && signal.length > 1) {
        for (let i = 1; i < signal.length; i++) {
            const x0 = map(time[i - 1], minX, maxX, 50, width - 50);
            const y0 = map(signal[i - 1], minY, maxY, height - 50, 50);
            const x1 = map(time[i], minX, maxX, 50, width - 50);
            line(x0, y0, x1, y0);
            const y1 = map(signal[i], minY, maxY, height - 50, 50);
            if (y1 !== y0) line(x1, y0, x1, y1);
        }
    }

    // Dibujar reconstrucción de Fourier si está disponible
    if (reconTime && reconSignal && reconTime.length === reconSignal.length && reconTime.length > 1) {
        stroke(74, 108, 247); // azul para Fourier
        strokeWeight(1.5);
        noFill();
        beginShape();
        for (let i = 0; i < reconTime.length; i++) {
            const x = map(reconTime[i], minX, maxX, 50, width - 50);
            const y = map(reconSignal[i], minY, maxY, height - 50, 50);
            vertex(x, y);
        }
        endShape();
    }
}

function drawAxes() {
    let axisColor = '#000';
    let numMarksX = 10;
    let numMarksY = 10;

    stroke(axisColor);
    strokeWeight(2);

    // Eje X
    line(50, height - 50, width - 50, height - 50);

    // Eje Y
    line(50, 50, 50, height - 50);

    // Marcas en el eje X - calcular marcas únicas
    textSize(12);
    textAlign(CENTER, CENTER);
    fill(axisColor);
    noStroke();

    let marcaXValues = [];
    for (let i = 0; i <= numMarksX; i++) {
        let value = map(i, 0, numMarksX, minX, maxX);
        let marcaValue = Math.round(value);

        // Evitar duplicados
        if (marcaXValues.indexOf(marcaValue) === -1) {
            marcaXValues.push(marcaValue);
            let x = map(marcaValue, minX, maxX, 50, width - 50);
            strokeWeight(1);
            line(x, height - 55, x, height - 45);
            text(marcaValue.toString(), x, height - 20);
        }
    }

    // Marcas en el eje Y - calcular marcas únicas
    let marcaYValues = [];
    for (let i = 0; i <= numMarksY; i++) {
        let value = map(i, 0, numMarksY, minY, maxY);
        let marcaValue = Math.round(value);

        // Evitar duplicados
        if (marcaYValues.indexOf(marcaValue) === -1) {
            marcaYValues.push(marcaValue);
            let y = map(marcaValue, minY, maxY, height - 50, 50);
            strokeWeight(1);
            line(45, y, 55, y);
            noStroke();
            fill(axisColor);
            text(marcaValue.toString(), 15, y);
        }
    }

    // Etiquetas de ejes
    textSize(14);
    text("Tiempo", width / 2, height - 10); // Moví más cerca del eje
    push();
    translate(15, height / 2); // Moví más cerca del eje
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

// No llamar setup() manualmente; p5.js lo invoca en modo global
document.addEventListener('DOMContentLoaded', function() {
    // placeholder para futuros hooks de DOM
});
