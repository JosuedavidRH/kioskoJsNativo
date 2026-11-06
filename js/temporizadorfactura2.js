// 📁 js/temporizadorfactura2.js

import { temporizador2 } from "./temporizador2.js";

export function temporizadorfactura2(onFinish) {
 const span = document.createElement("span");
  span.style.fontSize = "1.5rem";
  span.style.fontWeight = "bold";
  span.style.display = "inline-block";

   function render(timeLeft) {
    span.textContent = temporizador2.formatTime(timeLeft);

    if (timeLeft <= 0 && typeof onFinish === "function") {
      onFinish();
    }
  }
  temporizador2.onUpdate(render);

  render(temporizador2.timeLeft);

  // ⚡ Iniciar automáticamente si hay tiempo
  if (temporizador2.timeLeft > 0 && !temporizador2.isRunning) {
    temporizador2.start();
  }

  return span;
}