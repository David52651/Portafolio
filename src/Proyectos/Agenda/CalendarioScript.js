// calendarioScript.js

export function renderizarCalendario(eventos, fechaActual, elementos, mostrarEventosDelDia, mostrarEventosHoy) {
  const { gridCalendario, mesActualTexto } = elementos;

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);
  const diasPrevios = primerDia.getDay();
  const diasEnMes = ultimoDia.getDate();

  gridCalendario.innerHTML = "";
  mesActualTexto.textContent = fechaActual.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });

  for (let i = 0; i < diasPrevios; i++) {
    const celdaVacia = document.createElement("div");
    celdaVacia.classList.add("dia", "vacio");
    gridCalendario.appendChild(celdaVacia);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaTexto = `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const celda = document.createElement("div");
    celda.classList.add("dia");
    celda.dataset.fecha = fechaTexto;
    celda.innerHTML = `<span class="numero-dia">${dia}</span>`;

    const eventosDelDia = eventos.filter((e) => e.fecha === fechaTexto);
    if (eventosDelDia.length > 0) {
      const marcador = document.createElement("div");
      marcador.classList.add("marcador-evento");
      marcador.style.background = eventosDelDia[0].color;
      celda.appendChild(marcador);
    }

    celda.addEventListener("click", () => mostrarEventosDelDia(fechaTexto));
    gridCalendario.appendChild(celda);
  }

  mostrarEventosHoy();
}
