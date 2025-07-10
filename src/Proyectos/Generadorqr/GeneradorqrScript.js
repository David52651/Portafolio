let qr;

function generarQR() {
  const contenedor = document.getElementById("qrcode");
  const texto = document.getElementById("texto").value.trim();

  if (!contenedor) {
    console.error("No se encontró el contenedor #qrcode.");
    alert("Error interno: falta el contenedor para el QR.");
    return;
  }

  contenedor.innerHTML = ""; // Limpiar QR anterior

  if (texto === "") {
    alert("Introduce algún texto o URL.");
    return;
  }

  qr = new QRCode(contenedor, {
    text: texto,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  const botonDescarga = document.getElementById("descargar");
  if (botonDescarga) {
    botonDescarga.style.display = "inline-block";
  }
}

function descargarQR() {
  const img = document.querySelector("#qrcode img");
  if (!img) {
    alert("Primero genera el código QR.");
    return;
  }

  const enlace = document.createElement("a");
  enlace.href = img.src;
  enlace.download = "codigoQR.png";
  enlace.click();
}
