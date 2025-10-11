// js/temporizador2.js

class Temporizador2 extends EventTarget {
  constructor(initialTime = 1200) {
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
  }

  reset(newTime = 1200) {
    this.stop();
    this.timeLeft = newTime;
    localStorage.setItem("timeLeft2", newTime);
    this.dispatchUpdate();
  }

  formatTime(seconds = this.timeLeft) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  onUpdate(callback) {
    this.addEventListener("update", (e) => callback(e.detail));
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
