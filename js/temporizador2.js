// js/temporizador2.js

class Temporizador2 extends EventTarget {
  constructor(initialTime = 10800) {
    super();
    this.timeLeft = Number(localStorage.getItem("timeLeft2")) || initialTime;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft -= 1;
        localStorage.setItem("timeLeft2", this.timeLeft);
        this.dispatchUpdate();
      } else {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    this.dispatchUpdate();
  }

  reset(newTime =10800) {
    this.stop();
    this.timeLeft = newTime;
    localStorage.setItem("timeLeft2", newTime);
    this.dispatchUpdate();
  }

  // ⚡ Nuevo método
  setTimeLeft(value) {
    this.timeLeft = value;
    localStorage.setItem("timeLeft1", value);
    this.dispatchUpdate();

    if (this.timeLeft > 0 && !this.isRunning) {
      this.start();
    }
  }

  // 🔹 Formato HH:mm:ss
  formatTime(seconds = this.timeLeft) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

  onUpdate(callback) {
     this.addEventListener("update", (e) => callback(e.detail.timeLeft));
  }

  dispatchUpdate() {
    this.dispatchEvent(
      new CustomEvent("update", {
        detail: { timeLeft: this.timeLeft, isRunning: this.isRunning },
      })
    );
  }
}

export const temporizador2 = new Temporizador2();
