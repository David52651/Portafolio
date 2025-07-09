// notificaciones.js
export async function solicitarPermisoNotificaciones() {
  if (!("Notification" in window)) return false;

  const permiso = await Notification.requestPermission();
  return permiso === "granted";
}

export function mostrarNotificacion(titulo, opciones = {}) {
  if (Notification.permission === "granted") {
    new Notification(titulo, opciones);
  }
}
