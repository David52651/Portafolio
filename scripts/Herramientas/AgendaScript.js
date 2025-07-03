/// Variables globales
let eventos = JSON.parse(localStorage.getItem("eventosAgenda")) || [];
let categorias = ["personal", "trabajo", "recordatorio"];
let fechaActual = new Date();
let indiceEdicion = null;

const gridCalendario = document.getElementById("grid-calendario");
const mesActualTexto = document.getElementById("mes-actual");
const eventosHoy = document.getElementById("lista-eventos-hoy");
const panelDetalle = document.getElementById("panel-detalle");
const listaDetalleEventos = document.getElementById("lista-detalle-eventos");
const fechaDetalle = document.getElementById("fecha-detalle");
const modal = document.getElementById("modal-evento");
const formulario = document.getElementById("form-evento");

// Contenedores de vistas
const vistaMesContenedor = document.getElementById("vista-mes-contenedor");
const vistaSemanaContenedor = document.getElementById(
  "vista-semana-contenedor"
);
const vistaDiaContenedor = document.getElementById("vista-dia-contenedor");

// Botones de vista
const btnVistaMes = document.getElementById("vista-mes");
const btnVistaSemana = document.getElementById("vista-semana");
const btnVistaDia = document.getElementById("vista-dia");

// Función para renderizar el calendario mensual
function renderizarCalendario() {
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

  // Crear celdas vacías para el primer día de la semana
  for (let i = 0; i < diasPrevios; i++) {
    const celdaVacia = document.createElement("div");
    celdaVacia.classList.add("dia", "vacio");
    gridCalendario.appendChild(celdaVacia);
  }

  // Crear celdas para cada día del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaTexto = `${año}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
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

// Mostrar eventos del día actual (en la barra lateral)
function mostrarEventosHoy() {
  const hoy = new Date().toISOString().split("T")[0];
  const eventosDelDia = eventos.filter(e => e.fecha === hoy);

  eventosHoy.innerHTML = "";
  if (eventosDelDia.length === 0) {
    eventosHoy.innerHTML = "<li>No hay eventos</li>";
  } else {
    eventosDelDia.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.hora || ""} ${e.titulo}`;
      li.style.borderLeft = `4px solid ${e.color}`;
      eventosHoy.appendChild(li);
    });
  }
}

// Mostrar eventos en el panel lateral al hacer clic en un día (vista mensual)
function mostrarEventosDelDia(fecha) {
  const eventosDia = eventos.filter(e => e.fecha === fecha);
  fechaDetalle.textContent = new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  listaDetalleEventos.innerHTML = "";

  if (eventosDia.length === 0) {
    listaDetalleEventos.innerHTML = "<li>No hay eventos</li>";
  } else {
    eventosDia.forEach((e, i) => {
  const indexReal = eventos.findIndex(ev =>
    ev.titulo === e.titulo &&
    ev.fecha === e.fecha &&
    ev.hora === e.hora &&
    ev.descripcion === e.descripcion
  );

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${e.hora || ''} ${e.titulo}</strong><br/>
    <span>${e.descripcion || ''}</span><br/>
    <button class="editar-evento" data-id="${indexReal}">✏️ Editar</button>
    <button class="eliminar-evento" data-id="${indexReal}">🗑️ Eliminar</button>
  `;

      li.style.borderLeft = `4px solid ${e.color}`;
      listaDetalleEventos.appendChild(li);

      li.querySelector(".editar-evento").addEventListener("click", (ev) => {
        editarEvento(ev.target.dataset.id);
      });
      li.querySelector(".eliminar-evento").addEventListener("click", (ev) => {
        eliminarEvento(ev.target.dataset.id);
      });
    });
  }
  panelDetalle.classList.remove("oculto");
}

// Guardar evento
document.getElementById("form-evento").addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoEvento = {
    titulo: document.getElementById("titulo-evento").value,
    fecha: document.getElementById("fecha-evento").value,
    hora: document.getElementById("hora-evento").value,
    tipo: document.getElementById("tipo-evento").value.split(",").map(e => e.trim()),
    color: document.getElementById("color-evento").value,
    descripcion: document.getElementById("descripcion-evento").value,
  };

  if (indiceEdicion !== null) {
    // Estamos editando un evento existente
    eventos[indiceEdicion] = nuevoEvento;
    indiceEdicion = null; // Resetear después de editar
  } else {
    // Estamos creando un nuevo evento
    eventos.push(nuevoEvento);
  }
  // Registrar nueva categoría si no existe
const categoriaNueva = document.getElementById("tipo-evento").value.trim().toLowerCase();
if (categoriaNueva && !categorias.includes(categoriaNueva)) {
  categorias.push(categoriaNueva);
  actualizarListaCategorias();
}
  localStorage.setItem("eventosAgenda", JSON.stringify(eventos));
  cerrarModal();
  renderizarCalendario();
});



// Abrir/Cerrar modal
document.getElementById("btn-nuevo-evento").addEventListener("click", () => {
  indiceEdicion = null; // Asegura que estamos creando uno nuevo
  formulario.reset(); // Limpia campos anteriores
  modal.classList.remove("oculto");
});

document.getElementById("cancelar-evento").addEventListener("click", cerrarModal);

function cerrarModal() {
  modal.classList.add("oculto");
  formulario.reset();
  indiceEdicion = null;
}

//Editar Evento
function editarEvento(index) {
  const evento = eventos[index];
  indiceEdicion = index;
  document.getElementById("titulo-evento").value = evento.titulo;
  document.getElementById("fecha-evento").value = evento.fecha;
  document.getElementById("hora-evento").value = evento.hora;
  document.getElementById("tipo-evento").value = evento.tipo.join(", ");
  document.getElementById("color-evento").value = evento.color;
  document.getElementById("descripcion-evento").value = evento.descripcion;
  document.getElementById("modal-evento").classList.remove("oculto");
}

function eliminarEvento(index) {
  if (confirm("¿Estás seguro de eliminar este evento?")) {
    eventos.splice(index, 1);
    localStorage.setItem("eventosAgenda", JSON.stringify(eventos));
    renderizarCalendario();
    panelDetalle.classList.add("oculto");
  }
}

// Navegación de meses (solo para vista mensual)
document.getElementById("mes-anterior").addEventListener("click", () => {
  fechaActual.setMonth(fechaActual.getMonth() - 1);
  renderizarCalendario();
});
document.getElementById("mes-siguiente").addEventListener("click", () => {
  fechaActual.setMonth(fechaActual.getMonth() + 1);
  renderizarCalendario();
});

// Cambiar vistas
btnVistaMes.addEventListener("click", () => {
  cambiarVista("mes");
});
btnVistaSemana.addEventListener("click", () => {
  cambiarVista("semana");
});
btnVistaDia.addEventListener("click", () => {
  cambiarVista("dia");
});

function cambiarVista(vista) {
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

// Función para renderizar la vista semanal
function renderizarVistaSemana() {
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

// Función para renderizar la vista diaria
function renderizarVistaDia() {
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

// Navegación de días en vista diaria
document.getElementById("dia-anterior").addEventListener("click", () => {
  fechaActual.setDate(fechaActual.getDate() - 1);
  renderizarVistaDia();
});
document.getElementById("dia-siguiente").addEventListener("click", () => {
  fechaActual.setDate(fechaActual.getDate() + 1);
  renderizarVistaDia();
});

// Navegación de semanas en vista semanal
document.getElementById("semana-anterior").addEventListener("click", () => {
  fechaActual.setDate(fechaActual.getDate() - 7);
  renderizarVistaSemana();
});
document.getElementById("semana-siguiente").addEventListener("click", () => {
  fechaActual.setDate(fechaActual.getDate() + 7);
  renderizarVistaSemana();
});

// Funcion notificaciones y recordatorios
function programarRecordatorios() {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(permission => {
    if (permission !== "granted") return;

    const ahora = new Date();

    eventos.forEach(evento => {
      if (!evento.hora) return;
      const fechaEvento = new Date(`${evento.fecha}T${evento.hora}`);
      const diff = fechaEvento - ahora;

      if (diff > 0 && diff <= 60 * 60 * 1000) { // próximos 60 min
        setTimeout(() => {
          new Notification("Recordatorio", {
            body: `${evento.titulo} a las ${evento.hora}`,
          });
        }, diff);
      }
    });
  });
}

// Buscar evento
document.getElementById("busqueda-evento").addEventListener("input", e => {
  const termino = e.target.value.toLowerCase();
  const resultados = eventos.filter(ev =>
    ev.titulo.toLowerCase().includes(termino) ||
    (ev.descripcion || "").toLowerCase().includes(termino)
  );

  const contenedor = document.getElementById("resultados-busqueda");
  contenedor.innerHTML = resultados.map(ev => `
    <li>
      <strong>${ev.fecha} ${ev.hora || ""}</strong>: ${ev.titulo}
    </li>
  `).join("");
});

//Exportar Eventos
function exportarEventos() {
  const datos = JSON.stringify(eventos, null, 2);
  const blob = new Blob([datos], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "eventos.json";
  a.click();
}

//Importar Eventos
document.getElementById("importar-eventos").addEventListener("change", e => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(evento) {
    try {
      const nuevosEventos = JSON.parse(evento.target.result);
      if (Array.isArray(nuevosEventos)) {
        eventos = eventos.concat(nuevosEventos);
        localStorage.setItem("eventosAgenda", JSON.stringify(eventos));
        renderizarCalendario();
      } else {
        alert("Archivo inválido");
      }
    } catch {
      alert("No se pudo importar el archivo");
    }
  };
  lector.readAsText(archivo);
});

// Actualizar categorias
function actualizarListaCategorias() {
  const datalist = document.getElementById("lista-categorias");
  if (!datalist) return;

  datalist.innerHTML = "";
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    datalist.appendChild(option);
  });
}




// Inicializar - inicia en vista mensual
renderizarCalendario();
cambiarVista("mes");
programarRecordatorios();
actualizarListaCategorias();
