// IMPORTANTE: Pon aquí tu apiKey real de UniRateAPI
const apiKey = 'n0WJxN7wEpffOUhVKPieqYw98bMeQA95YCta601RZahWecb9HEKaoliEX7kg2f9l';

async function convertir() {
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const from = document.getElementById("monedaOrigen").value;
  const to = document.getElementById("monedaDestino").value;

  if (isNaN(cantidad)) {
    alert("Ingresa una cantidad válida.");
    return;
  }

  const url = `https://api.unirateapi.com/api/convert?api_key=${apiKey}&from=${from}&to=${to}&amount=${cantidad}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    document.getElementById("resultado").textContent =
      `Resultado: ${data.result.toFixed(2)} ${data.to}`;

    // Atribución requerida
    document.getElementById("attribution").innerHTML =
      `<a href="https://unirateapi.com" target="_blank" rel="noopener">Exchange Rates By UniRateAPI</a>`;
  } catch (err) {
    console.error(err);
    alert("Error al conectarse a la API: " + err.message);
  }
}
// intercambiar valores de los selectores
function intercambiarMonedas() {
  const origen = document.getElementById("monedaOrigen");
  const destino = document.getElementById("monedaDestino");
  [origen.value, destino.value] = [destino.value, origen.value];
}

async function cargarMonedas() {
  const url = `https://api.unirateapi.com/api/currencies?api_key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const monedas = data.currencies;
    const selectOrigen = document.getElementById('monedaOrigen');
    const selectDestino = document.getElementById('monedaDestino');

    selectOrigen.innerHTML = '';
    selectDestino.innerHTML = '';

    monedas.forEach(codigo => {
      const opcion1 = document.createElement('option');
      opcion1.value = codigo;
      opcion1.textContent = codigo;
      selectOrigen.appendChild(opcion1);

      const opcion2 = document.createElement('option');
      opcion2.value = codigo;
      opcion2.textContent = codigo;
      selectDestino.appendChild(opcion2);
    });

    selectOrigen.value = 'USD';
    selectDestino.value = 'EUR';

  } catch (error) {
    console.error("Error al cargar monedas:", error);
    alert("No se pudieron cargar las monedas.");
  }
}


// Ejecutar al cargar
cargarMonedas();
