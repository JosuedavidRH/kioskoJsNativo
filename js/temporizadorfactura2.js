// 📁 js/temporizadorfactura2.js

import { temporizador2 } from "./temporizador2.js";

export function temporizadorfactura2(onFinish) {
  // 🔹 Crear elemento HTML donde se mostrará el tiempo
  const span = document.createElement("span");
  span.style.fontSize = "1.5rem";
  span.style.fontWeight = "bold";
  span.style.display = "inline-block";

  // 🔹 Función para actualizar el span
  function render() {
    span.textContent = temporizador2.formatTime(temporizador2.timeLeft);

    if (temporizador2.timeLeft <= 0 && typeof onFinish === "function") {
      onFinish();
    }
  }

  // 🔹 Escuchar cambios del temporizador
  temporizador2.onUpdate(render);

  // 🔹 Iniciar el temporizador si no está corriendo y hay tiempo
  if (!temporizador2.isRunning && temporizador2.timeLeft > 0) {
    temporizador2.start();
  }

  // 🔹 Actualización automática cada segundo (refresca la vista)
  const interval = setInterval(() => {
    render();
    if (temporizador2.timeLeft <= 0) clearInterval(interval);
  }, 1000);

  // 🔹 Render inicial
  render();

  return span;
}
