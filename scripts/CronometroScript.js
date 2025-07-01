let cronometroActivo = false;
let tiempoTranscurrido = 0;
let intervaloCronometro;

function actualizarCronometro() {
  const horas = Math.floor(tiempoTranscurrido / 3600);
  const minutos = Math.floor((tiempoTranscurrido % 3600) / 60);
  const segundos = tiempoTranscurrido % 60;

  const display = document.getElementById("cronometro");
  if (display) {
    display.textContent = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }
}

function iniciarCronometro() {
  if (typeof modoActual !== 'undefined' && modoActual !== "cronometro") return;
  if (cronometroActivo) return;

  cronometroActivo = true;

  intervaloCronometro = setInterval(() => {
    tiempoTranscurrido++;
    actualizarCronometro();
  }, 1000);

  const iniciarBtn = document.getElementById("iniciarCronoBtn");
  const detenerBtn = document.getElementById("detenerCronoBtn");
  if (iniciarBtn) iniciarBtn.disabled = true;
  if (detenerBtn) detenerBtn.disabled = false;
}

function detenerCronometro() {
  clearInterval(intervaloCronometro);
  cronometroActivo = false;

  const iniciarBtn = document.getElementById("iniciarCronoBtn");
  const detenerBtn = document.getElementById("detenerCronoBtn");
  if (iniciarBtn) iniciarBtn.disabled = false;
  if (detenerBtn) detenerBtn.disabled = true;
}

function reiniciarCronometro() {
  detenerCronometro();
  tiempoTranscurrido = 0;
  actualizarCronometro();
}

document.addEventListener("DOMContentLoaded", actualizarCronometro);
