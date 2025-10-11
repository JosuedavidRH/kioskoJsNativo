// js/temporizador1.js

class Temporizador1 extends EventTarget {
  constructor(initialTime = 30) {
    super();
    this.timeLeft = Number(localStorage.getItem("timeLeft1")) || initialTime;
    this.interval = null;
    this.isRunning = false;
  }

  // 🔹 Iniciar el temporizador
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft -= 1;
        localStorage.setItem("timeLeft1", this.timeLeft);
        this.dispatchUpdate();
      } else {
        this.stop();
      }
    }, 1000);
  }

  // 🔹 Detener el temporizador
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }

  // 🔹 Reiniciar con un nuevo tiempo
  reset(newTime = 30) {
    this.stop();
    this.timeLeft = newTime;
    localStorage.setItem("timeLeft1", newTime);
    this.dispatchUpdate();
  }

  // 🔹 Formatear mm:ss
  formatTime(seconds = this.timeLeft) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  // 🔹 Escuchar cambios desde otros módulos
  onUpdate(callback) {
    this.addEventListener("update", (e) => callback(e.detail));
  }

  // 🔹 Emitir actualización
  dispatchUpdate() {
    this.dispatchEvent(
      new CustomEvent("update", {
        detail: { timeLeft: this.timeLeft, isRunning: this.isRunning },
      })
    );
  }
}

// ✅ Exportar una sola instancia global con el mismo nombre
export const temporizador1 = new Temporizador1();
