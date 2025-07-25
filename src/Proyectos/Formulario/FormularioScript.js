document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formularioRegistro");

  const campos = {
    nombre: false,
    email: false,
    telefono: false,
    password: false,
    confirmarPassword: false,
    pais: false,
    terminos: false
  };

  // Funciones auxiliares
  function mostrarError(campo, mensaje) {
    campo.classList.add("invalido");
    campo.classList.remove("valido");

    let error = campo.nextElementSibling;
    if (!error || !error.classList.contains("mensaje-error")) {
      error = document.createElement("span");
      error.classList.add("mensaje-error");
      campo.insertAdjacentElement("afterend", error);
    }
    error.textContent = mensaje;
  }

  function limpiarError(campo) {
    campo.classList.remove("invalido");
    campo.classList.add("valido");
    const error = campo.nextElementSibling;
    if (error && error.classList.contains("mensaje-error")) {
      error.textContent = "";
    }
  }

  // Validadores por campo
  function validarNombre() {
    const campo = document.getElementById("nombre");
    if (campo.value.trim().length < 3) {
      mostrarError(campo, "Nombre muy corto.");
      campos.nombre = false;
    } else {
      limpiarError(campo);
      campos.nombre = true;
    }
  }

  function validarEmail() {
    const campo = document.getElementById("email");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(campo.value.trim())) {
      mostrarError(campo, "Correo no válido.");
      campos.email = false;
    } else {
      limpiarError(campo);
      campos.email = true;
    }
  }

  function validarTelefono() {
    const campo = document.getElementById("telefono");
    const regex = /^[0-9]{7,15}$/;
    if (!regex.test(campo.value.trim())) {
      mostrarError(campo, "Teléfono inválido (solo números).");
      campos.telefono = false;
    } else {
      limpiarError(campo);
      campos.telefono = true;
    }
  }

  function validarPassword() {
    const campo = document.getElementById("password");
    if (campo.value.length < 8) {
      mostrarError(campo, "Mínimo 8 caracteres.");
      campos.password = false;
    } else {
      limpiarError(campo);
      campos.password = true;
    }
    validarConfirmarPassword(); // Revalidar coincidencia
  }

  function validarConfirmarPassword() {
    const campo = document.getElementById("confirmarPassword");
    const password = document.getElementById("password").value;
    if (campo.value !== password || campo.value.length < 8) {
      mostrarError(campo, "Las contraseñas no coinciden.");
      campos.confirmarPassword = false;
    } else {
      limpiarError(campo);
      campos.confirmarPassword = true;
    }
  }

  function validarPais() {
    const campo = document.getElementById("pais");
    if (campo.value === "") {
      mostrarError(campo, "Selecciona un país.");
      campos.pais = false;
    } else {
      limpiarError(campo);
      campos.pais = true;
    }
  }

  function validarTerminos() {
    const campo = document.getElementById("terminos");
    if (!campo.checked) {
      campo.classList.add("invalido");
      campos.terminos = false;
    } else {
      campo.classList.remove("invalido");
      campos.terminos = true;
    }
  }

  // Asociar validaciones a eventos
  document.getElementById("nombre").addEventListener("input", validarNombre);
  document.getElementById("email").addEventListener("input", validarEmail);
  document.getElementById("telefono").addEventListener("input", validarTelefono);
  document.getElementById("password").addEventListener("input", validarPassword);
  document.getElementById("confirmarPassword").addEventListener("input", validarConfirmarPassword);
  document.getElementById("pais").addEventListener("change", validarPais);
  document.getElementById("terminos").addEventListener("change", validarTerminos);

  // Validación final al enviar
  formulario.addEventListener("submit", (e) => {
    validarNombre();
    validarEmail();
    validarTelefono();
    validarPassword();
    validarConfirmarPassword();
    validarPais();
    validarTerminos();

    const todoCorrecto = Object.values(campos).every(valor => valor === true);
    if (!todoCorrecto) {
      e.preventDefault();
      alert("Por favor completa todos los campos correctamente.");
    }
  });
});
