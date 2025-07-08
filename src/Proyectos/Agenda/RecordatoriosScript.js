// recordatoriosScript.js
// 👉 Maneja las notificaciones locales de eventos próximos

function programarRecordatorios(eventos) {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") return;

    const ahora = new Date();

    eventos.forEach((evento) => {
      if (!evento.hora) return;

      const fechaEvento = new Date(`${evento.fecha}T${evento.hora}`);
      const diff = fechaEvento - ahora;

      // Notificar solo si el evento es dentro de la próxima hora
      if (diff > 0 && diff <= 60 * 60 * 1000) {
        setTimeout(() => {
          new Notification("Recordatorio", {
            body: `${evento.titulo} a las ${evento.hora}`,
          });
        }, diff);
      }
    });
  });
}
