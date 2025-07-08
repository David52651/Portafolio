// unirateApi.js

const apiKey = 'n0WJxN7wEpffOUhVKPieqYw98bMeQA95YCta601RZahWecb9HEKaoliEX7kg2f9l';

export async function obtenerMonedas() {
  const url = `https://api.unirateapi.com/api/currencies?api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.currencies;
}

export async function convertirMoneda(from, to, amount) {
  const url = `https://api.unirateapi.com/api/convert?api_key=${apiKey}&from=${from}&to=${to}&amount=${amount}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}
