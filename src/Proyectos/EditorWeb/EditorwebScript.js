document.addEventListener('DOMContentLoaded', () => {
  const htmlInput = document.getElementById('html');
  const cssInput = document.getElementById('css');
  const jsInput = document.getElementById('js');
  const runButton = document.getElementById('run');
  const previewFrame = document.getElementById('preview');
  const alertasDiv = document.getElementById('alertas');

  let debounceTimer;

  function getInputValues() {
    return {
      html: htmlInput.value,
      css: cssInput.value,
      js: jsInput.value
    };
  }

  function renderPreview() {
    const { html, css, js } = getInputValues();
    mostrarErrores(html, js);

    const contenido = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch (e) {
            document.body.innerHTML += '<pre style="color:red;">Error: ' + e.message + '</pre>';
          }
        <\/script>
      </body>
      </html>
    `;

    previewFrame.srcdoc = contenido;
  }

  function mostrarErrores(html, js) {
    alertasDiv.innerHTML = '';

    const advertencias = [
      { tag: '<html>', count: (html.match(/<html>/gi) || []).length },
      { tag: '<body>', count: (html.match(/<body>/gi) || []).length }
    ];

    advertencias.forEach(({ tag, count }) => {
      if (count > 1) {
        alertasDiv.innerHTML += `<p>⚠️ Tienes múltiples etiquetas <code>${tag}</code></p>`;
      }
    });

    try {
      new Function(js);
    } catch (error) {
      alertasDiv.innerHTML += `<p>❌ Error de JavaScript: ${error.message}</p>`;
    }
  }

  function descargarCodigo(tipo) {
    const contenido = getInputValues()[tipo];
    const nombreArchivo = `${tipo}.txt`;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  // Accesible globalmente
  window.descargarCodigo = descargarCodigo;

  runButton.addEventListener('click', renderPreview);

  [htmlInput, cssInput, jsInput].forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(renderPreview, 400);
    });
  });

  renderPreview(); // Render inicial
});
