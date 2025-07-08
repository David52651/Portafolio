// buscadorScript.js
// 👉 Maneja la lógica de búsqueda de eventos en la agenda

import { obtenerEventos } from './EventosScript.js';

export function configurarBuscador() {
  const inputBusqueda = document.getElementById("busqueda-evento");
  const contenedorResultados = document.getElementById("resultados-busqueda");

  if (!inputBusqueda || !contenedorResultados) return;

  inputBusqueda.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase();
    const eventos = obtenerEventos();

    const resultados = eventos.filter((ev) =>
      ev.titulo.toLowerCase().includes(termino) ||
      (ev.descripcion || "").toLowerCase().includes(termino)
    );

    contenedorResultados.innerHTML = resultados
      .map(
        (ev) => `
        <li>
          <strong>${ev.fecha} ${ev.hora || ""}</strong>: ${ev.titulo}
        </li>`
      )
      .join("");
  });
}
