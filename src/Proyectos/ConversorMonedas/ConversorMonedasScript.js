//ConversorMonedasScript.js

import { obtenerMonedas, convertirMoneda } from '../../shared/api/unirateApi.js';

document.addEventListener("DOMContentLoaded", () => {
  const cantidadInput = document.getElementById("cantidad");
  const monedaOrigen = document.getElementById("monedaOrigen");
  const monedaDestino = document.getElementById("monedaDestino");
  const resultadoEl = document.getElementById("resultado");
  const attributionEl = document.getElementById("attribution");
  const btnConvertir = document.getElementById("btnConvertir");
  const btnIntercambiar = document.getElementById("btnIntercambiar");

  async function cargarMonedas() {
    try {
      const monedas = await obtenerMonedas();
      monedas.sort();

      monedaOrigen.innerHTML = '';
      monedaDestino.innerHTML = '';

      monedas.forEach(codigo => {
        monedaOrigen.appendChild(new Option(codigo, codigo));
        monedaDestino.appendChild(new Option(codigo, codigo));
      });

      monedaOrigen.value = 'USD';
      monedaDestino.value = 'EUR';
    } catch (error) {
      console.error("Error al cargar monedas:", error);
      alert("No se pudieron cargar las monedas.");
    }
  }

  async function convertir() {
    const cantidad = parseFloat(cantidadInput.value);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Ingresa una cantidad válida.");
      return;
    }

    resultadoEl.textContent = "Convirtiendo...";
    btnConvertir.disabled = true;

    try {
      const { result, to } = await convertirMoneda(monedaOrigen.value, monedaDestino.value, cantidad);
      resultadoEl.textContent = `Resultado: ${result.toFixed(2)} ${to}`;
      attributionEl.innerHTML = `<a href="https://unirateapi.com" target="_blank" rel="noopener">Exchange Rates by UniRateAPI</a>`;
    } catch (error) {
      console.error("Error al convertir:", error);
      resultadoEl.textContent = "Error al convertir.";
      alert("Error al conectar con la API.");
    } finally {
      btnConvertir.disabled = false;
    }
  }

  function intercambiarMonedas() {
    [monedaOrigen.value, monedaDestino.value] = [monedaDestino.value, monedaOrigen.value];
  }

  // Asignar eventos
  btnConvertir.addEventListener("click", convertir);
  btnIntercambiar.addEventListener("click", intercambiarMonedas);

  // Cargar monedas al inicio
  cargarMonedas();
});
