// categoriasScript.js
// 👉 Funciones relacionadas con la gestión de categorías de eventos

export let categorias = ["personal", "trabajo", "recordatorio"];

// Actualiza el <datalist> con las categorías disponibles
export function actualizarListaCategorias() {
  const datalist = document.getElementById("lista-categorias");
  if (!datalist) return;

  datalist.innerHTML = "";
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    datalist.appendChild(option);
  });
}

// Agrega una o varias categorías si no existen
export function agregarCategoriaSiNoExiste(categoriasNuevas) {
  categoriasNuevas.forEach(cat => {
    const categoriaNormalizada = cat.trim().toLowerCase();
    if (categoriaNormalizada && !categorias.includes(categoriaNormalizada)) {
      categorias.push(categoriaNormalizada);
    }
  });
  actualizarListaCategorias();
}
