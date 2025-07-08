// AgendaScript.js (archivo principal)

// Importaciones desde módulos
import {
  guardarEvento,
  editarEvento,
  eliminarEvento,
  mostrarEventosDelDia,
  obtenerEventos,
  programarRecordatorios,
  setIndiceEdicion
} from './EventosScript.js';

import { renderizarCalendario } from './CalendarioScript.js';
import { renderizarVistaSemana, renderizarVistaDia } from './VistasScript.js';
import { configurarBuscador } from './BuscadorScript.js';
import {
  actualizarListaCategorias,
  agregarCategoriaSiNoExiste
} from './CategoriasScript.js';
import { configurarBotonesExportarImportar } from './ExportarImportarScript.js';

// Variables globales
let fechaActual = new Date();

// Elementos del DOM
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
const vistaSemanaContenedor = document.getElementById("vista-semana-contenedor");
const vistaDiaContenedor = document.getElementById("vista-dia-contenedor");

// Botones
const btnVistaMes = document.getElementById("vista-mes");
const btnVistaSemana = document.getElementById("vista-semana");
const btnVistaDia = document.getElementById("vista-dia");
const btnMesAnterior = document.getElementById("mes-anterior");
const btnMesSiguiente = document.getElementById("mes-siguiente");
const btnNuevoEvento = document.getElementById("btn-nuevo-evento");

// Mostrar eventos de hoy
function mostrarEventosHoy() {
  const hoy = new Date().toISOString().split("T")[0];
  const eventosHoyFiltrados = obtenerEventos().filter(e => e.fecha === hoy);

  eventosHoy.innerHTML = "";
  if (eventosHoyFiltrados.length === 0) {
    eventosHoy.innerHTML = "<li>No hay eventos</li>";
  } else {
    eventosHoyFiltrados.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.hora || ""} ${e.titulo}`;
      li.style.borderLeft = `4px solid ${e.color}`;
      eventosHoy.appendChild(li);
    });
  }
}

// Renderizar calendario completo
function renderizarTodo() {
  renderizarCalendario(
    obtenerEventos(),
    fechaActual,
    { gridCalendario, mesActualTexto },
    (fecha) =>
      mostrarEventosDelDia(
        fecha,
        listaDetalleEventos,
        fechaDetalle,
        panelDetalle
      ),
    mostrarEventosHoy
  );
}

// Nuevo evento
btnNuevoEvento.addEventListener("click", () => {
  setIndiceEdicion(null);
  formulario.reset();
  modal.classList.remove("oculto");
});

document.getElementById("cancelar-evento").addEventListener("click", cerrarModal);

function cerrarModal() {
  modal.classList.add("oculto");
  formulario.reset();
  setIndiceEdicion(null);
}

// Guardar evento
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoEvento = {
    titulo: document.getElementById("titulo-evento").value,
    fecha: document.getElementById("fecha-evento").value,
    hora: document.getElementById("hora-evento").value,
    tipo: document.getElementById("tipo-evento").value.split(",").map(e => e.trim()),
    color: document.getElementById("color-evento").value,
    descripcion: document.getElementById("descripcion-evento").value,
  };

  guardarEvento(nuevoEvento);
  agregarCategoriaSiNoExiste(nuevoEvento.tipo);
  cerrarModal();
  renderizarTodo();
});

// Navegación entre meses
btnMesAnterior.addEventListener("click", () => {
  fechaActual.setMonth(fechaActual.getMonth() - 1);
  renderizarTodo();
});

btnMesSiguiente.addEventListener("click", () => {
  fechaActual.setMonth(fechaActual.getMonth() + 1);
  renderizarTodo();
});

// Cambiar vistas
btnVistaMes.addEventListener("click", () => cambiarVista("mes"));
btnVistaSemana.addEventListener("click", () => cambiarVista("semana"));
btnVistaDia.addEventListener("click", () => cambiarVista("dia"));

function cambiarVista(vista) {
  [btnVistaMes, btnVistaSemana, btnVistaDia].forEach((btn) =>
    btn.classList.remove("active")
  );

  if (vista === "mes") btnVistaMes.classList.add("active");
  if (vista === "semana") btnVistaSemana.classList.add("active");
  if (vista === "dia") btnVistaDia.classList.add("active");

  vistaMesContenedor.classList.add("oculto");
  vistaSemanaContenedor.classList.add("oculto");
  vistaDiaContenedor.classList.add("oculto");

  if (vista === "mes") {
    vistaMesContenedor.classList.remove("oculto");
    renderizarTodo();
  } else if (vista === "semana") {
    vistaSemanaContenedor.classList.remove("oculto");
    renderizarVistaSemana(fechaActual, obtenerEventos());
  } else if (vista === "dia") {
    vistaDiaContenedor.classList.remove("oculto");
    renderizarVistaDia(fechaActual, obtenerEventos());
  }
}

// Buscador de eventos
const busqueda = document.getElementById("busqueda-evento");
busqueda.addEventListener("input", (e) => {
  const termino = e.target.value.toLowerCase();
  const resultados = obtenerEventos().filter(ev =>
    ev.titulo.toLowerCase().includes(termino) ||
    (ev.descripcion || "").toLowerCase().includes(termino)
  );

  const contenedor = document.getElementById("resultados-busqueda");
  contenedor.innerHTML = resultados.map(ev => `
    <li><strong>${ev.fecha} ${ev.hora || ""}</strong>: ${ev.titulo}</li>
  `).join("");
});

// ✅ Solo esta línea es suficiente para exportar e importar eventos
configurarBotonesExportarImportar(obtenerEventos(), renderizarTodo);

// Inicializar
renderizarTodo();
cambiarVista("mes");
programarRecordatorios();
actualizarListaCategorias();
configurarBuscador();
