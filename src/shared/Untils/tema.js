// Detecta el esquema de color del sistema y aplica el modo
function aplicarTemaPreferido() {
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (prefiereOscuro) {
    document.documentElement.classList.add('modo-oscuro');
    document.documentElement.classList.remove('modo-claro');
  } else {
    document.documentElement.classList.add('modo-claro');
    document.documentElement.classList.remove('modo-oscuro');
  }
}

// Escucha cambios en la preferencia del sistema (oscuro/claro)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarTemaPreferido);

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', aplicarTemaPreferido);
