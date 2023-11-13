var myChart;

async function calcularCambio() {
    var cantidad = parseFloat(document.getElementById('cantidad').value);
    var monedaBase = document.querySelector('.boton-pais.active').dataset.moneda;

    try {
        var response = await fetch(`https://api.frankfurter.app/latest?from=${monedaBase}`);
        var data = await response.json();

        var tasasCambio = data.rates;

        // Eliminé las opciones KRW e IDR
        delete tasasCambio.KRW;
        delete tasasCambio.IDR;

        var valoresCambiados = Object.keys(tasasCambio).map(tasa => cantidad * tasasCambio[tasa]);

        actualizarGrafico(Object.keys(tasasCambio), valoresCambiados);
        actualizarResultados(Object.keys(tasasCambio), valoresCambiados);

        // Mostrar el gráfico y los resultados
        document.getElementById('grafico-container').style.display = 'block';
        document.getElementById('resultados-container').style.display = 'block';
    } catch (error) {
        console.error('Error al obtener datos de tasas de cambio:', error);
    }
}

function seleccionarMoneda(event) {
    var botonesPaises = document.querySelectorAll('.boton-pais');
    botonesPaises.forEach(function (boton) {
        boton.classList.remove('active');
    });

    var botonSeleccionado = event.target;
    botonSeleccionado.classList.add('active');
}

function actualizarGrafico(paises, valoresCambiados) {
    var ctx = document.getElementById('grafico').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    var datos = {
        labels: paises,
        datasets: [{
            label: 'Cambio de Valor',
            backgroundColor: 'rgba(41, 128, 185, 0.2)', // Azul
            borderColor: 'rgba(41, 128, 185, 1)',
            borderWidth: 1,
            data: valoresCambiados,
        }]
    };

    var opciones = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    myChart = new Chart(ctx, {
        type: 'bar',
        data: datos,
        options: opciones
    });
}

function actualizarResultados(paises, valoresCambiados) {
    var tablaResultados = document.getElementById('tablaResultados');
    var tbody = tablaResultados.querySelector('tbody');
    tbody.innerHTML = '';

    // Mostrar hasta 10 resultados
    for (var i = 0; i < Math.min(paises.length, 10); i++) {
        var fila = tbody.insertRow();
        var celdaPais = fila.insertCell(0);
        var celdaValor = fila.insertCell(1);

        celdaPais.textContent = paises[i];
        celdaValor.textContent = valoresCambiados[i].toFixed(2);
    }
}
