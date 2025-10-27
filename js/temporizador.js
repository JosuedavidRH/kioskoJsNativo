// js/temporizador.js  analiza  el codigo de produccion pero no modifiques nada

import { cerrarSesionGlobal } from "./utils/cerrarSesion.js";



class Temporizador extends EventTarget {
  constructor() {
    super();
    this.timeLeft = Number(localStorage.getItem("timeLeftPrincipal")) || 43200; // 12h por defecto
    this.isRunning = false;
    this.fondoRojo = this.timeLeft <= 0;
    this.interval = null;
    this.apartmentNumber = null;
    this.statusActual = 0;
  }

  // 🔹 Inicializar con datos de usuario
  init({ apartmentNumber, initialTime = 43200, statusActual = 0 }) {
    this.apartmentNumber = apartmentNumber;
    this.statusActual = statusActual;
    if (!localStorage.getItem("timeLeftPrincipal")) {
      this.timeLeft = initialTime;
      localStorage.setItem("timeLeftPrincipal", initialTime);
    }
    this.dispatchUpdate();
  }

  // 🔹 Notificar a los listeners
  dispatchUpdate() {
    this.dispatchEvent(
      new CustomEvent("update", {
        detail: {
          timeLeft: this.timeLeft,
          isRunning: this.isRunning,
          fondoRojo: this.fondoRojo,
        },
      })
    );
  }

  // 🔹 Formatear HH:mm:ss
  formatTimeLeft(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // 🔹 Iniciar/reiniciar temporizador
  startCountdown(secondsToRun = 43200) {
    this.stop(); // limpiar interval previo
    this.timeLeft = secondsToRun;
    this.fondoRojo = false;
    this.isRunning = true;
    localStorage.setItem("timeLeftPrincipal", this.timeLeft);
    this.dispatchUpdate();

    if (this.apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: this.timeLeft,
        userId: this.apartmentNumber,
        statusActual: this.statusActual,
      });
    }

    this.interval = setInterval(() => {
      if (this.timeLeft <= 1) {
        this.timeLeft = 0;
        this.isRunning = false;
        this.fondoRojo = true;
        clearInterval(this.interval);

        if (this.apartmentNumber) {
          cerrarSesionGlobal({
            auto: false,
            temporizadorPrincipal: 0,
            userId: this.apartmentNumber,
            statusActual: this.statusActual,
          });
        }
      } else {
        this.timeLeft -= 1;
        localStorage.setItem("timeLeftPrincipal", this.timeLeft);
      }
      this.dispatchUpdate();
    }, 1000);
  }

  // 🔹 Detener y persistir
  stopAndPersist() {
    this.stop();
    if (this.apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: this.timeLeft,
        userId: this.apartmentNumber,
        statusActual: this.statusActual,
      });
    }
    this.dispatchUpdate();
  }

  // 🔹 Detener sin persistir
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }
}

// Exportamos una sola instancia global
export const temporizador = new Temporizador();
