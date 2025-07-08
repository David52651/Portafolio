let tiempoRestante = 0;
let alarmaActiva = false;
let intervaloAlarma = null;
let intervalo;

function actualizarTimer() {
  const horas = Math.floor(tiempoRestante / 3600);
  const minutos = Math.floor((tiempoRestante % 3600) / 60);
  const segundos = tiempoRestante % 60;
  const timerDisplay = document.getElementById("timer");
  if (timerDisplay) {
    timerDisplay.textContent = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }
}

function iniciarTemporizador() {
  if (typeof modoActual !== 'undefined' && modoActual !== "temporizador") return;

  const inputHoras = parseInt(document.getElementById("horas").value) || 0;
  const inputMin = parseInt(document.getElementById("minutos").value) || 0;
  const inputSeg = parseInt(document.getElementById("segundos").value) || 0;

  if (inputHoras < 0 || inputMin < 0 || inputSeg < 0) {
    alert("No se permiten valores negativos.");
    return;
  }

  if ((inputHoras === 0 && inputMin === 0 && inputSeg === 0) || intervalo) {
    return;
  }

  tiempoRestante = inputHoras * 3600 + inputMin * 60 + inputSeg;
  actualizarTimer();

  document.getElementById("iniciarBtn").disabled = true;
  document.getElementById("detenerBtn").disabled = false;

  intervalo = setInterval(() => {
    if (tiempoRestante > 0) {
      tiempoRestante--;
      actualizarTimer();
    } else {
      clearInterval(intervalo);
      intervalo = null;
      document.getElementById("iniciarBtn").disabled = false;
      document.getElementById("detenerBtn").disabled = true;
      reproducirAlarma();
    }
  }, 1000);
}

function detenerTemporizador() {
  clearInterval(intervalo);
  intervalo = null;
  detenerAlarma();
  document.getElementById("iniciarBtn").disabled = false;
  document.getElementById("detenerBtn").disabled = true;
}

function reiniciarTemporizador() {
  detenerTemporizador();
  tiempoRestante = 0;
  actualizarTimer();
  document.getElementById("horas").value = "";
  document.getElementById("minutos").value = "";
  document.getElementById("segundos").value = "";
}

function reproducirAlarma() {
  if (typeof modoActual !== 'undefined' && modoActual !== "temporizador") return;

  alarmaActiva = true;
  const alarmaBtn = document.getElementById("detenerAlarmaBtn");
  if (alarmaBtn) alarmaBtn.style.display = "inline-block";

  const context = new (window.AudioContext || window.webkitAudioContext)();
  const notasReMayor = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33];

  const totalNotas = 6;
  const duracionNota = 0.3;
  const volumen = 0.3;
  let startTime = context.currentTime;

  for (let i = 0; i < totalNotas; i++) {
    const freq = notasReMayor[Math.floor(Math.random() * notasReMayor.length)];
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.frequency.setValueAtTime(freq, startTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(volumen, startTime);

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start(startTime);
    osc.stop(startTime + duracionNota);

    startTime += duracionNota;
  }

  alert("¡Tiempo terminado!");
  detenerAlarma();
}

function detenerAlarma() {
  alarmaActiva = false;
  clearTimeout(intervaloAlarma);
  const alarmaBtn = document.getElementById("detenerAlarmaBtn");
  if (alarmaBtn) alarmaBtn.style.display = "none";
}

actualizarTimer();