// exportarImportarScript.js
// 👉 Funciones para exportar e importar eventos

import { obtenerEventos } from './EventosScript.js';
import { guardarEventos } from './AlmacenamientoScript.js';

// Exporta eventos como archivo JSON
export function exportarEventos() {
  const eventos = obtenerEventos();
  const datos = JSON.stringify(eventos, null, 2);
  const blob = new Blob([datos], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "eventos.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Configura un input de tipo archivo para importar eventos
export function configurarImportacion(inputArchivo, renderizarCallback) {
  inputArchivo.addEventListener("change", (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function (evento) {
      try {
        const nuevosEventos = JSON.parse(evento.target.result);
        if (!Array.isArray(nuevosEventos)) {
          alert("Archivo inválido");
          return;
        }

        const eventosActuales = obtenerEventos();
        const eventosActualizados = eventosActuales.concat(nuevosEventos);
        guardarEventos(eventosActualizados);

        if (renderizarCallback) renderizarCallback();
      } catch {
        alert("No se pudo importar el archivo");
      }
    };
    lector.readAsText(archivo);
  });
}

// Configura los botones de exportar e importar
export function configurarBotonesExportarImportar(renderizarCallback) {
  const btnExportar = document.getElementById("btn-exportar-eventos");
  const inputImportar = document.getElementById("importar-eventos");

  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      exportarEventos();
    });
  }

  if (inputImportar) {
    configurarImportacion(inputImportar, renderizarCallback);
  }
}
