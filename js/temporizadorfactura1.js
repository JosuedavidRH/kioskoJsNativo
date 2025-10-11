

// 📁 js/temporizadorfactura1.js
import { temporizador1 } from "./temporizador1.js";

export function temporizadorfactura1(onFinish) {
  // 🔹 Crear elemento HTML donde se mostrará el tiempo
  const span = document.createElement("span");
  span.style.fontSize = "1.5rem";
  span.style.fontWeight = "bold";
  span.style.display = "inline-block";

  // 🔹 Función para actualizar el span
  function render() {
    span.textContent = temporizador1.formatTime(temporizador1.timeLeft);

    if (temporizador1.timeLeft <= 0 && typeof onFinish === "function") {
      onFinish();
    }
  }

  // 🔹 Escuchar cambios del temporizador
  temporizador1.onUpdate(render);

  // 🔹 Iniciar el temporizador si no está corriendo y hay tiempo
  if (!temporizador1.isRunning && temporizador1.timeLeft > 0) {
    temporizador1.start();
  }

  // 🔹 Actualización automática cada segundo (refresca la vista)
  const interval = setInterval(() => {
    render();
    if (temporizador1.timeLeft <= 0) clearInterval(interval);
  }, 1000);

  // 🔹 Render inicial
  render();

  return span;
}
