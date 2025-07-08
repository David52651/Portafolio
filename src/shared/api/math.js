// src/shared/api/math.js
export async function convertirConMathJS(valor, de, a) {
  const expresion = encodeURIComponent(`${valor}${de} to ${a}`);
  const url = `https://api.mathjs.org/v4/?expr=${expresion}`;

  try {
    const res = await fetch(url);
    const resultadoTexto = await res.text();
    const numero = parseFloat(resultadoTexto);
    return isNaN(numero) ? NaN : numero;
  } catch (error) {
    console.error('Error al convertir:', error);
    return NaN;
  }
}
