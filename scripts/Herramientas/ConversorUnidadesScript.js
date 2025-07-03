const categorias = {
  Longitud: ['km', 'm', 'cm', 'mi'],
  Temperatura: ['°C', '°F', 'K'],
  Masa: ['kg', 'g', 'lb'],
  Velocidad: ['km/h', 'm/s', 'mi/h']
};

// Obtener la categoría de una unidad
function obtenerCategoria(unidad) {
  return Object.entries(categorias).find(([_, unidades]) => unidades.includes(unidad))?.[0];
}

// Validar si dos unidades están en la misma categoría
function mismaCategoria(de, a) {
  return Object.values(categorias).some(cat => cat.includes(de) && cat.includes(a));
}

// Obtener el nombre legible de una unidad (opcional)
function obtenerNombreUnidad(u) {
  const nombres = {
    'km': 'Kilómetro', 'm': 'Metro', 'cm': 'Centímetro', 'mi': 'Milla',
    '°C': 'Celsius', '°F': 'Fahrenheit', 'K': 'Kelvin',
    'kg': 'Kilogramo', 'g': 'Gramo', 'lb': 'Libra',
    'km/h': 'km/h', 'm/s': 'm/s', 'mi/h': 'mph'
  };
  return nombres[u] || u;
}

// Filtrar unidades en el segundo select según la categoría del primero
function filtrarUnidades() {
  const unidadDesde = document.getElementById('unidad-desde').value;
  const unidadHasta = document.getElementById('unidad-hasta');
  const categoria = obtenerCategoria(unidadDesde);

  if (!categoria) return;

  unidadHasta.innerHTML = ''; // limpiar

  categorias[categoria].forEach(u => {
    const opcion = document.createElement('option');
    opcion.value = u;
    opcion.textContent = obtenerNombreUnidad(u);
    unidadHasta.appendChild(opcion);
  });

  validarUnidades(); // valida y actualiza botón
}

// Función para convertir usando Math.js API
async function convertirConMathJS(valor, de, a) {
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

// Ejecutar conversión
async function convertirUnidad() {
  const valor = parseFloat(document.getElementById('valor').value);
  const de = document.getElementById('unidad-desde').value;
  const a = document.getElementById('unidad-hasta').value;
  const resultadoElement = document.getElementById('resultado-valor');

  if (isNaN(valor)) {
    resultadoElement.textContent = 'Ingresa un número válido.';
    return;
  }

  if (!mismaCategoria(de, a)) {
    resultadoElement.textContent = 'Las unidades no son compatibles.';
    return;
  }

  resultadoElement.textContent = 'Convirtiendo...';

  const resultado = await convertirConMathJS(valor, de, a);

  resultadoElement.textContent = isNaN(resultado)
    ? 'Error en la conversión.'
    : `${resultado.toFixed(4)} ${a}`;
}

// Intercambiar unidades
document.getElementById('intercambiar').addEventListener('click', () => {
  const desde = document.getElementById('unidad-desde');
  const hasta = document.getElementById('unidad-hasta');
  const temp = desde.value;
  desde.value = hasta.value;
  hasta.value = temp;

  filtrarUnidades(); // re-generar el select correcto
});

// Validar compatibilidad
function validarUnidades() {
  const de = document.getElementById('unidad-desde').value;
  const a = document.getElementById('unidad-hasta').value;
  const btn = document.getElementById('convertir');
  const resultado = document.getElementById('resultado-valor');

  const validas = mismaCategoria(de, a);
  btn.disabled = !validas;

  if (!validas) {
    resultado.textContent = 'Unidades incompatibles.';
  }
}

// DOM listo
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('convertir').addEventListener('click', convertirUnidad);
  document.getElementById('unidad-desde').addEventListener('change', () => {
    filtrarUnidades();
  });
  document.getElementById('unidad-hasta').addEventListener('change', validarUnidades);

  filtrarUnidades(); // inicializar el select "hasta"
});
