// almacenamientoScript.js
// 👉 Maneja la carga y guardado de eventos en localStorage, así como importación/exportación
// Cargar eventos desde localStorage
export function cargarEventos() {
  const data = localStorage.getItem("eventosAgenda");
  return data ? JSON.parse(data) : [];
}

// Guardar eventos en localStorage
export function guardarEventos(listaEventos) {
  localStorage.setItem("eventosAgenda", JSON.stringify(listaEventos));
}

// Exportar eventos como archivo JSON
export function exportarEventos(eventos) {
  const datos = JSON.stringify(eventos, null, 2);
  const blob = new Blob([datos], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "eventos.json";
  a.click();
}

// Importar eventos desde archivo JSON
export function importarEventos(archivo, callback) {
  const lector = new FileReader();
  lector.onload = function (evento) {
    try {
      const nuevosEventos = JSON.parse(evento.target.result);
      if (Array.isArray(nuevosEventos)) {
        callback(nuevosEventos); // pasamos los eventos al callback
      } else {
        alert("Archivo inválido");
      }
    } catch {
      alert("No se pudo importar el archivo");
    }
  };
  lector.readAsText(archivo);
}
