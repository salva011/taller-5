document.addEventListener('DOMContentLoaded', function() {
    const tablaCalendario = document.getElementById('tabla-calendario');
    const tituloMes = document.getElementById('titulo-mes');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const vistaSemanal = document.getElementById('vista-semanal');
    const vistaMensual = document.getElementById('vista-mensual');
    const vistaAnual = document.getElementById('vista-anual');
    const formularioAgenda = document.getElementById('formulario-agenda');
    const inputFecha = document.getElementById('input-fecha');
    const inputHora = document.getElementById('input-hora');
    const inputDescripcion = document.getElementById('input-descripcion');
    const inputParticipantes = document.getElementById('input-participantes');
    let eventoVisible = false;

  
    let eventos = [];
    let fechaActual = new Date();
    let vistaActual = 'mensual';

    function renderizarCalendario() {
        const year = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();
        const primerDia = new Date(year, mes, 1).getDay();
        const ultimoDia = new Date(year, mes + 1, 0).getDate();

        tablaCalendario.innerHTML = '';

        if (vistaActual === 'mensual') {
            tituloMes.textContent = `${fechaActual.toLocaleString('default', { month: 'long' })} ${year}`;
            for (let i = 0; i < primerDia; i++) {
                const divVacio = document.createElement('div');
                tablaCalendario.appendChild(divVacio);
            }

            for (let dia = 1; dia <= ultimoDia; dia++) {
                const divDia = document.createElement('div');
                divDia.textContent = dia;
                divDia.addEventListener('click', () => seleccionarFecha(dia));
                tablaCalendario.appendChild(divDia);
            }
        } else if (vistaActual === 'semanal') {
            tituloMes.textContent = `Semana de ${fechaActual.toLocaleDateString()}`;
            const primerDiaSemana = fechaActual.getDate() - fechaActual.getDay();
            for (let i = 0; i < 7; i++) {
                const dia = primerDiaSemana + i;
                const fechaDia = new Date(year, mes, dia);
                const divDia = document.createElement('div');
                divDia.textContent = fechaDia.getDate();
                divDia.addEventListener('click', () => seleccionarFecha(fechaDia.getDate()));
                tablaCalendario.appendChild(divDia);
            }
        } else if (vistaActual === 'anual') {
            tituloMes.textContent = `Año ${year}`;
            for (let i = 0; i < 12; i++) {
                const divMes = document.createElement('div');
                divMes.textContent = new Date(year, i).toLocaleString('default', { month: 'long' });
                divMes.addEventListener('click', () => seleccionarMes(i));
                tablaCalendario.appendChild(divMes);
            }
        }
    }

    function seleccionarFecha(dia) {
        const fechaSeleccionada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia);
        inputFecha.value = fechaSeleccionada.toISOString().split('T')[0];
    }

    function seleccionarMes(mes) {
        fechaActual.setMonth(mes);
        vistaActual = 'mensual';
        renderizarCalendario();
        mostrarEventos();
    }

    formularioAgenda.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const nuevoEvento = {
            fecha: inputFecha.value,
            hora: inputHora.value,
            descripcion: inputDescripcion.value,
            participantes: inputParticipantes.value
        };

        eventos.push(nuevoEvento);
        mostrarEventos();
        formularioAgenda.reset();
    });

    function mostrarEventos() {
        const elementosDias = document.querySelectorAll('#tabla-calendario div');

        elementosDias.forEach((elemento, indice) => {
            if (vistaActual === 'mensual' || vistaActual === 'semanal') {
                const dia = vistaActual === 'mensual'
                    ? indice - new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay() + 1
                    : new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - fechaActual.getDay() + indice).getDate();
                const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia).toISOString().split('T')[0];
                const evento = eventos.find(e => e.fecha === fecha);
                if (evento) {
                    elemento.style.backgroundColor = '#ddd';
                } else {
                    elemento.style.backgroundColor = '#fff';
                }
            } else if (vistaActual === 'anual') {
                const mes = indice;
                const eventosMes = eventos.filter(e => new Date(e.fecha).getMonth() === mes);
                if (eventosMes.length > 0) {
                    elemento.style.backgroundColor = '#ddd';
                } else {
                    elemento.style.backgroundColor = '#fff';
                }
            }
        });
    }

    btnAnterior.addEventListener('click', () => {
        if (vistaActual === 'mensual') {
            fechaActual.setMonth(fechaActual.getMonth() - 1);
        } else if (vistaActual === 'semanal') {
            fechaActual.setDate(fechaActual.getDate() - 7);
        } else if (vistaActual === 'anual') {
            fechaActual.setFullYear(fechaActual.getFullYear() - 1);
        }
        renderizarCalendario();
        mostrarEventos();
    });

    btnSiguiente.addEventListener('click', () => {
        if (vistaActual === 'mensual') {
            fechaActual.setMonth(fechaActual.getMonth() + 1);
        } else if (vistaActual === 'semanal') {
            fechaActual.setDate(fechaActual.getDate() + 7);
        } else if (vistaActual === 'anual') {
            fechaActual.setFullYear(fechaActual.getFullYear() + 1);
        }
        renderizarCalendario();
        mostrarEventos();
    });

    vistaSemanal.addEventListener('click', () => {
        vistaActual = 'semanal';
        renderizarCalendario();
        mostrarEventos();
    });

    vistaMensual.addEventListener('click', () => {
        vistaActual = 'mensual';
        renderizarCalendario();
        mostrarEventos();
    });

    vistaAnual.addEventListener('click', () => {
        vistaActual = 'anual';
        renderizarCalendario();
        mostrarEventos();
    });

    renderizarCalendario();
    mostrarEventos();
});