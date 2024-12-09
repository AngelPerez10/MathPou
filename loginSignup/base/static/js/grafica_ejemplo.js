function setupGraph(containerId, dataUrl) {
    // Crea una nueva instancia de p5 para cada contenedor
    new p5((p) => {
        let amplitudes, phases, time, signal;
        let minX, maxX, minY, maxY;

        p.setup = () => {
            p.createCanvas(600,400).parent(containerId);
            // Usa fetch en el contexto global para la URL específica
            fetch(dataUrl)
                .then(response => response.json())
                .then(data => {
                    amplitudes = data.amplitudes;
                    phases = data.phases;
                    time = data.time;
                    signal = data.signal;
                    minX = Math.min(...time);
                    maxX = Math.max(...time);
                    minY = Math.min(...signal);
                    maxY = Math.max(...signal);
                    p.drawGraph(); // Dibuja la gráfica después de cargar los datos
                })
                .catch(error => console.error('Error fetching data:', error));
        };

        p.drawGraph = () => {
            p.background(255);
            p.strokeWeight(2);
            p.beginShape();
            for (let i = 0; i < signal.length; i++) {
                let x = p.map(time[i], minX, maxX, 60, p.width - 60);
                let y = p.map(signal[i], minY, maxY, p.height - 60, 60);
                p.vertex(x, y);
            }
            p.endShape();
            p.drawAxes();
        };

        p.drawAxes = () => {
            let axisColor = '#000';
            let numMarksX = 10; // Número de marcas en el eje X
            let numMarksY = 10; // Número de marcas en el eje Y

            // Dibuja los ejes
            p.stroke(axisColor);
            p.strokeWeight(2);
            p.line(60, p.height - 60, p.width - 60, p.height - 60); // Eje X
            p.line(60, 60, 60, p.height - 60); // Eje Y

            // Añade marcas y texto en el eje X
            p.textAlign(p.CENTER, p.CENTER);
            for (let i = 0; i <= numMarksX; i++) {
                let value = p.map(i, 0, numMarksX, minX, maxX);
                let x = p.map(value, minX, maxX, 60, p.width - 60);
                p.strokeWeight(1);
                p.line(x, p.height - 65, x, p.height - 55); // Marca pequeña
                p.noStroke();
                p.fill(axisColor);
                p.text(value.toFixed(1), x, p.height - 30); // Texto numérico
            }

            // Añade marcas y texto en el eje Y
            for (let i = 0; i <= numMarksY; i++) {
                let value = p.map(i, 0, numMarksY, minY, maxY);
                let y = p.map(value, minY, maxY, p.height - 60, 60);
                p.strokeWeight(1);
                p.line(55, y, 65, y); // Marca pequeña
                p.noStroke();
                p.fill(axisColor);
                p.text(value.toFixed(1), 25, y); // Texto numérico
            }
        };
    });
}


// Configura los gráficos para los contenedores
// Configura los gráficos para los contenedores con diferentes URLs
setupGraph('plot-container1', '/grafica_example/1/');
setupGraph('plot-container2', '/grafica_example/2/');
setupGraph('plot-container3', '/grafica_example/3/');
setupGraph('plot-container4', '/grafica_example/4/');


//funcion de boton de desarrollo

document.getElementById("ejem1").addEventListener("click",function(){


});
