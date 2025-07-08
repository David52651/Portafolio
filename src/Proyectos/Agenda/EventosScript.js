// EventosScript.js
import { guardarEventos, cargarEventos } from './AlmacenamientoScript.js';

let eventos = cargarEventos();
let indiceEdicion = null;

export function obtenerEventos() {
  return eventos;
}

export function getIndiceEdicion() {
  return indiceEdicion;
}

export function setIndiceEdicion(index) {
  indiceEdicion = index;
}

export function guardarEvento(nuevoEvento) {
  if (indiceEdicion !== null) {
    eventos[indiceEdicion] = nuevoEvento;
    indiceEdicion = null;
  } else {
    eventos.push(nuevoEvento);
  }
  guardarEventos(eventos);
}

export function eliminarEvento(index, renderizarCallback, ocultarPanelCallback) {
  if (confirm("¿Estás seguro de eliminar este evento?")) {
    eventos.splice(index, 1);
    guardarEventos(eventos);
    if (renderizarCallback) renderizarCallback();
    if (ocultarPanelCallback) ocultarPanelCallback();
  }
}

export function editarEvento(index, formularioCallback) {
  const evento = eventos[index];
  indiceEdicion = index;
  if (formularioCallback) formularioCallback(evento);
}

export function mostrarEventosDelDia(fecha, contenedorLista, fechaElemento, panel) {
  const eventosDia = eventos.filter(e => e.fecha === fecha);
  fechaElemento.textContent = new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  contenedorLista.innerHTML = "";

  if (eventosDia.length === 0) {
    contenedorLista.innerHTML = "<li>No hay eventos</li>";
  } else {
    eventosDia.forEach((e) => {
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
      contenedorLista.appendChild(li);
    });
  }

  // Delegación para botones de editar y eliminar
  contenedorLista.onclick = (e) => {
    const btn = e.target;
    const index = parseInt(btn.dataset.id, 10);

    if (btn.classList.contains("editar-evento")) {
      editarEvento(index, (evento) => {
        const modal = document.getElementById("modal-evento");
        const formulario = document.getElementById("form-evento");

        document.getElementById("titulo-evento").value = evento.titulo;
        document.getElementById("fecha-evento").value = evento.fecha;
        document.getElementById("hora-evento").value = evento.hora;
        document.getElementById("tipo-evento").value = evento.tipo.join(", ");
        document.getElementById("color-evento").value = evento.color;
        document.getElementById("descripcion-evento").value = evento.descripcion;

        modal.classList.remove("oculto");
      });
    }

    if (btn.classList.contains("eliminar-evento")) {
      eliminarEvento(index, () => {
        mostrarEventosDelDia(fecha, contenedorLista, fechaElemento, panel);
      }, () => {
        panel.classList.add("oculto");
      });
    }
  };

  panel.classList.remove("oculto");
}

export function mostrarEventosHoy(contenedor) {
  const hoy = new Date().toISOString().split("T")[0];
  const eventosDelDia = eventos.filter(e => e.fecha === hoy);

  contenedor.innerHTML = "";
  if (eventosDelDia.length === 0) {
    contenedor.innerHTML = "<li>No hay eventos</li>";
  } else {
    eventosDelDia.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.hora || ""} ${e.titulo}`;
      li.style.borderLeft = `4px solid ${e.color}`;
      contenedor.appendChild(li);
    });
  }
}

export function programarRecordatorios() {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(permission => {
    if (permission !== "granted") return;

    const ahora = new Date();

    eventos.forEach(evento => {
      if (!evento.hora) return;
      const fechaEvento = new Date(`${evento.fecha}T${evento.hora}`);
      const diff = fechaEvento - ahora;

      if (diff > 0 && diff <= 60 * 60 * 1000) {
        setTimeout(() => {
          new Notification("Recordatorio", {
            body: `${evento.titulo} a las ${evento.hora}`,
          });
        }, diff);
      }
    });
  });
}

