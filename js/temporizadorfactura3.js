// 📁 js/temporizadorfactura3.js

import { temporizador3 } from "./temporizador3.js";

export function temporizadorfactura3(onFinish) {
  // 🔹 Crear elemento HTML donde se mostrará el tiempo
  const span = document.createElement("span");
  span.style.fontSize = "1.5rem";
  span.style.fontWeight = "bold";
  span.style.display = "inline-block";

  // 🔹 Función para actualizar el span
  function render() {
    span.textContent = temporizador3.formatTime(temporizador3.timeLeft);

    if (temporizador3.timeLeft <= 0 && typeof onFinish === "function") {
      onFinish();
    }
  }

  // 🔹 Escuchar cambios del temporizador
  temporizador3.onUpdate(render);

  // 🔹 Iniciar el temporizador si no está corriendo y hay tiempo
  if (!temporizador3.isRunning && temporizador3.timeLeft > 0) {
    temporizador3.start();
  }

  // 🔹 Actualización automática cada segundo (refresca la vista)
  const interval = setInterval(() => {
    render();
    if (temporizador3.timeLeft <= 0) clearInterval(interval);
  }, 1000);

  // 🔹 Render inicial
  render();

  return span;
}
