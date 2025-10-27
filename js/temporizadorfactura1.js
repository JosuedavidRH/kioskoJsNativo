// 📁 js/temporizadorfactura1.js analiza  el codigo de produccion pero no modifiques nada


import { temporizador1 } from "./temporizador1.js";

export function temporizadorfactura1(onFinish) {
  const span = document.createElement("span");
  span.style.fontSize = "3rem";
  span.style.fontWeight = "bold";
  span.style.display = "inline-block";

  function render(timeLeft) {
    span.textContent = temporizador1.formatTime(timeLeft);

    if (timeLeft <= 0 && typeof onFinish === "function") {
      onFinish();
    }
  }

  temporizador1.onUpdate(render);

  render(temporizador1.timeLeft);

  // ⚡ Iniciar automáticamente si hay tiempo
  if (temporizador1.timeLeft > 0 && !temporizador1.isRunning) {
    temporizador1.start();
  }

  return span;
}
