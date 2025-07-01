let pantalla = document.getElementById('pantalla');
let operacion = '';
let mostrarResultado = false;
let parenAbiertos = 0;
let historial = [];

const contenedorHistorial = document.getElementById('historial');

function agregar(valor) {
  // Si mostramos resultado y se ingresa número o paréntesis abierto, reiniciamos operacion
  if (mostrarResultado && /^[0-9(]/.test(valor)) {
    operacion = valor;
    mostrarResultado = false;
    parenAbiertos = (valor === '(') ? 1 : 0; // reiniciamos contador si es '('
  }
  // Si mostramos resultado y se ingresa otro tipo de valor (ej. operador), concatenamos a resultado
  else if (mostrarResultado) {
    operacion += valor;
    mostrarResultado = false;
    // Actualizamos contador paréntesis según valor agregado
    if (valor === '(') parenAbiertos++;
    else if (valor === ')') parenAbiertos = Math.max(0, parenAbiertos - 1);
  }
  else {
    operacion += valor;
    if (valor === '(') parenAbiertos++;
    else if (valor === ')') parenAbiertos = Math.max(0, parenAbiertos - 1);
  }

  actualizarPantalla();
}

function limpiar() {
  operacion = '';
  parenAbiertos = 0;
  mostrarResultado = false;
  actualizarPantalla();
}


function borrar() {
  if (operacion.length > 0) {
    const ultimo = operacion.slice(-1);
    // Ajustar contador de paréntesis
    if (ultimo === '(') parenAbiertos = Math.max(0, parenAbiertos - 1);
    else if (ultimo === ')') parenAbiertos++;
    operacion = operacion.slice(0, -1);
    actualizarPantalla();
  }
}

// --- Funciones auxiliares ---
function reemplazarConstantes(exp) {
  return exp
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');
}

function reemplazarFuncionesMatematicas(exp) {
  return exp
    .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
    .replace(/√([0-9.]+)/g, 'Math.sqrt($1)')
    .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
    .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
    .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');
}

function reemplazarFuncionesTrigonométricas(exp) {
  return exp
    .replace(/sin\(([^)]+)\)/g, (_, x) => `Math.sin((${x}) * Math.PI / 180)`)
    .replace(/cos\(([^)]+)\)/g, (_, x) => `Math.cos((${x}) * Math.PI / 180)`)
    .replace(/tan\(([^)]+)\)/g, (_, x) => `Math.tan((${x}) * Math.PI / 180)`);
}

function reemplazarPotencias(exp) {
  return exp.replace(/([a-zA-Zπe0-9.()]+)\^([a-zA-Zπe0-9.()]+)/g, 'Math.pow($1,$2)');
}

function reemplazarFactoriales(exp) {
  return exp.replace(/(\d+)!/g, (_, n) => `factorial(${n})`);
}

function reemplazarPorcentajes(exp) {
  return exp.replace(/([0-9.]+)%/g, '($1/100)');
}

function calcular() {
  try {
    const abiertos = (operacion.match(/\(/g) || []).length;
    const cerrados = (operacion.match(/\)/g) || []).length;
    if (cerrados > abiertos) throw new Error("Paréntesis desbalanceados");

    // ✅ Guardar la operación original ANTES de modificarla
    const expresionOriginal = operacion;

    let expresion = operacion + ')'.repeat(abiertos - cerrados);

    expresion = reemplazarConstantes(expresion);
    expresion = reemplazarFuncionesMatematicas(expresion);
    expresion = reemplazarFuncionesTrigonométricas(expresion);
    expresion = reemplazarPotencias(expresion);
    expresion = reemplazarPorcentajes(expresion);
    expresion = reemplazarFactoriales(expresion);

    let resultado = Function('"use strict"; return (' + expresion + ')')();

    resultado = parseFloat(resultado.toFixed(10));

    operacion = resultado.toString();
    mostrarResultado = true;
    parenAbiertos = 0;

    actualizarPantalla();

    // ✅ Aquí usamos la operación original para mostrar correctamente el historial
    agregarAHistorial(expresionOriginal, resultado);
  } catch (e) {
    operacion = '';
    mostrarResultado = false;
    parenAbiertos = 0;
    pantalla.textContent = 'Error';
  }
}


function actualizarParentesisFantasma() {
  // Guardamos el texto puro sin el span de paréntesis fantasma
  const texto = pantalla.textContent;

  // Limpiamos el contenido html
  pantalla.innerHTML = '';

  // Insertamos solo el texto limpio
  const nodoTexto = document.createTextNode(texto);
  pantalla.appendChild(nodoTexto);

  // Si hay paréntesis abiertos, agregamos el span con paréntesis de cierre fantasma
  if (parenAbiertos > 0) {
    const spanFantasma = document.createElement('span');
    spanFantasma.className = 'ghost';
    spanFantasma.textContent = ')'.repeat(parenAbiertos);
    pantalla.appendChild(spanFantasma);
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function agregarAHistorial(op, res) {
  const item = document.createElement('div');
  item.className = 'item-historial';
  item.textContent = `${op} = ${res}`;
  item.onclick = () => {
    operacion = res.toString();
    mostrarResultado = true;
    parenAbiertos = 0;
    actualizarPantalla();
  };

  const titulo = contenedorHistorial.querySelector('h2');
  if (titulo) {
    contenedorHistorial.insertBefore(item, titulo.nextSibling);
  } else {
    contenedorHistorial.appendChild(item);
  }
}

function actualizarPantalla() {
  pantalla.innerHTML = '';
  const texto = document.createTextNode(operacion);
  pantalla.appendChild(texto);

  if (parenAbiertos > 0) {
    const span = document.createElement('span');
    span.className = 'ghost';
    span.textContent = ')'.repeat(parenAbiertos);
    pantalla.appendChild(span);
  }

  if (operacion.length === 0) {
    pantalla.textContent = '0';
  }
}