// vistasScript.js
// 👉 Funciones para cambiar y renderizar vistas del calendario

export function cambiarVista(vista, elementos, renderizarCalendario, renderizarVistaSemana, renderizarVistaDia) {
  const { btnVistaMes, btnVistaSemana, btnVistaDia, vistaMesContenedor, vistaSemanaContenedor, vistaDiaContenedor } = elementos;

  // Actualizar botones activos
  [btnVistaMes, btnVistaSemana, btnVistaDia].forEach((btn) =>
    btn.classList.remove("active")
  );
  if (vista === "mes") btnVistaMes.classList.add("active");
  if (vista === "semana") btnVistaSemana.classList.add("active");
  if (vista === "dia") btnVistaDia.classList.add("active");

  // Ocultar todos los contenedores y luego mostrar el seleccionado
  vistaMesContenedor.classList.add("oculto");
  vistaSemanaContenedor.classList.add("oculto");
  vistaDiaContenedor.classList.add("oculto");

  if (vista === "mes") {
    vistaMesContenedor.classList.remove("oculto");
    renderizarCalendario();
  } else if (vista === "semana") {
    vistaSemanaContenedor.classList.remove("oculto");
    renderizarVistaSemana();
  } else if (vista === "dia") {
    vistaDiaContenedor.classList.remove("oculto");
    renderizarVistaDia();
  }
}

export function renderizarVistaSemana(fechaActual, eventos) {
  const contenedor = document.getElementById("semana-grid");
  contenedor.innerHTML = "";

  const inicioSemana = new Date(fechaActual);
  for (let i = 0; i < 7; i++) {
    const fechaSemana = new Date(inicioSemana);
    fechaSemana.setDate(inicioSemana.getDate() + i);
    const fechaTexto = fechaSemana.toISOString().split("T")[0];

    const eventosDia = eventos.filter((e) => e.fecha === fechaTexto);
    const diaNombre = fechaSemana.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const columna = document.createElement("div");
    columna.classList.add("dia-semana");

    const titulo = document.createElement("h4");
    titulo.textContent = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);
    columna.appendChild(titulo);

    if (eventosDia.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Sin eventos";
      p.style.fontSize = "0.9rem";
      columna.appendChild(p);
    } else {
      eventosDia.forEach((ev) => {
        const eventoEl = document.createElement("div");
        eventoEl.classList.add("evento");
        eventoEl.textContent = `${ev.hora || ""} ${ev.titulo}`;
        eventoEl.style.borderLeft = `4px solid ${ev.color}`;
        columna.appendChild(eventoEl);
      });
    }
    contenedor.appendChild(columna);
  }
}

export function renderizarVistaDia(fechaActual, eventos) {
  const contenedor = document.getElementById("dia-detalle");
  contenedor.innerHTML = "";

  const fechaTexto = fechaActual.toISOString().split("T")[0];
  const eventosDelDia = eventos.filter((e) => e.fecha === fechaTexto);

  const titulo = document.createElement("h3");
  titulo.textContent = fechaActual.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  contenedor.appendChild(titulo);

  if (eventosDelDia.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay eventos para hoy.";
    contenedor.appendChild(p);
  } else {
    eventosDelDia.forEach((ev) => {
      const eventoEl = document.createElement("div");
      eventoEl.classList.add("evento-dia");
      eventoEl.innerHTML = `<strong>${ev.hora || ""} ${ev.titulo}</strong><br>${
        ev.descripcion || ""
      }`;
      eventoEl.style.borderLeft = `4px solid ${ev.color}`;
      contenedor.appendChild(eventoEl);
    });
  }
}
