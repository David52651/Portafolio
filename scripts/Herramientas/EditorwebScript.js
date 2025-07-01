document.addEventListener('DOMContentLoaded', () => {
  const htmlInput = document.getElementById('html');
  const cssInput = document.getElementById('css');
  const jsInput = document.getElementById('js');
  const runButton = document.getElementById('run');
  const previewFrame = document.getElementById('preview');
  const alertasDiv = document.getElementById('alertas');

  let timeout;

  // Función principal para renderizar el código
  function renderPreview() {
    const htmlCode = htmlInput.value;
    const cssCode = cssInput.value;
    const jsCode = jsInput.value;

    // Validar código antes de renderizar
    mostrarErrores(htmlCode, jsCode);

    const output = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          try {
            ${jsCode}
          } catch (e) {
            document.body.innerHTML += '<pre style="color:red;">Error: ' + e.message + '</pre>';
          }
        <\/script>
      </body>
      </html>
    `;

    previewFrame.srcdoc = output;
  }

  // Ejecutar manualmente con botón
  runButton.addEventListener('click', renderPreview);

  // Live preview con debounce
  [htmlInput, cssInput, jsInput].forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(renderPreview, 500); // Ejecutar medio segundo después de dejar de escribir
    });
  });

  // Función para mostrar errores básicos
  function mostrarErrores(html, js) {
    alertasDiv.innerHTML = '';

    // Error: body o html duplicado
    if ((html.match(/<html>/gi) || []).length > 1) {
      alertasDiv.innerHTML += '<p>⚠️ Tienes múltiples etiquetas <code>&lt;html&gt;</code></p>';
    }
    if ((html.match(/<body>/gi) || []).length > 1) {
      alertasDiv.innerHTML += '<p>⚠️ Tienes múltiples etiquetas <code>&lt;body&gt;</code></p>';
    }

    // Validar JS sintácticamente (solo errores de parsing)
    try {
      new Function(js); // Esto lanza si hay errores
    } catch (error) {
      alertasDiv.innerHTML += `<p>❌ Error de JavaScript: ${error.message}</p>`;
    }
  }

  // Descargar código como .txt
  window.descargarCodigo = function (tipo) {
    let contenido = '';
    let nombreArchivo = '';

    switch (tipo) {
      case 'html':
        contenido = htmlInput.value;
        nombreArchivo = 'codigo.html.txt';
        break;
      case 'css':
        contenido = cssInput.value;
        nombreArchivo = 'estilos.css.txt';
        break;
      case 'js':
        contenido = jsInput.value;
        nombreArchivo = 'script.js.txt';
        break;
      default:
        return;
    }

    const blob = new Blob([contenido], { type: 'text/plain' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  };

  // Render inicial
  renderPreview();
});
