// 📁 js/temporizador3.js

class Temporizador3 extends EventTarget {
  constructor(initialTime = 1200) {
    super();
    this.timeLeft = Number(localStorage.getItem("timeLeft3")) || initialTime;
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
        localStorage.setItem("timeLeft3", this.timeLeft);
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
  reset(newTime = 1200) {
    this.stop();
    this.timeLeft = newTime;
    localStorage.setItem("timeLeft3", newTime);
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

// ✅ Exportar una sola instancia global
export const temporizador3 = new Temporizador3();
