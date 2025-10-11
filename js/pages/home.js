
// js/pages/home.js

import { temporizador } from "../temporizador.js";
import { temporizador2 } from "../temporizador2.js";
import { temporizador3 } from "../temporizador3.js";



import { ContenedoresPaginaPrincipal } from "../components/ContenedoresPaginaPrincipal.js";
import { BotonPrincipal } from "../components/BotonPrincipal.js";

export function HomePage(user, onLogout) {
  const wrapper = document.createElement("div");
  wrapper.className = "home-container";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.height = "100vh";
  wrapper.style.backgroundColor = "#282c34";
  wrapper.style.color = "white";
  wrapper.style.fontFamily = "Arial, sans-serif";
  wrapper.style.padding = "20px";
  wrapper.style.textAlign = "center";

  // --- Bienvenida ---
  const title = document.createElement("h2");
  title.textContent = `Bienvenido, ${user.username} (Apto: ${user.apartmentNumber})`;
  wrapper.appendChild(title);

  // 🔹 Leer estados desde localStorage para reflejar la vista real
  let clickCount = Number(localStorage.getItem("clickCount") || 0);
  let factura1Terminada = localStorage.getItem("factura1Terminada") === "true";
  let factura2Terminada = localStorage.getItem("factura2Terminada") === "true";
  let factura3Terminada = localStorage.getItem("factura3Terminada") === "true";
  let clicked = localStorage.getItem("clicked") === "true";

  // 🟢 Inicializar temporizador global con el usuario actual
  temporizador.init({
    apartmentNumber: user.apartmentNumber,
    initialTime: Number(localStorage.getItem("timeLeftPrincipal")) || 43200,
    statusActual: 0,
  });

  // --- Temporizador principal ---
  const timerBox = document.createElement("div");
  timerBox.style.fontSize = "21px";
  timerBox.style.fontWeight = "bold";

  // 👇 solo se muestra si clickCount > 0
  if (clickCount > 0) {
    wrapper.appendChild(timerBox);

    // Función que actualiza la vista del temporizador
    function updateTimer() {
      timerBox.textContent = `PLAZO DE PAGO ${temporizador.formatTimeLeft(temporizador.timeLeft)}`;
    }

    // Actualización inicial
    updateTimer();

    // 🔹 Escuchar los eventos del temporizador sin duplicar intervalos
    temporizador.addEventListener("update", (e) => {
      const { timeLeft } = e.detail;
      timerBox.textContent = `PLAZO DE PAGO ${temporizador.formatTimeLeft(timeLeft)}`;
    });

    // 🔁 Si hay un tiempo guardado y el temporizador no está corriendo, reanúdalo
    const savedTime = Number(localStorage.getItem("timeLeftPrincipal") || 0);
    if (savedTime > 0 && !temporizador.isRunning) {
      temporizador.startCountdown(savedTime);
    }
  }

  // --- Contenedores de facturas ---
  const contenedores = ContenedoresPaginaPrincipal({
    clickCount,
    factura1Terminada,
    factura2Terminada,
    factura3Terminada,
    clicked,
    setFactura1Terminada: (v) => { 
      localStorage.setItem("factura1Terminada", v); 
      factura1Terminada = v;
      render(); 
    },
    setFactura2Terminada: (v) => { 
      localStorage.setItem("factura2Terminada", v); 
      factura2Terminada = v;
      render(); 
    },
    setFactura3Terminada: (v) => { 
      localStorage.setItem("factura3Terminada", v); 
      factura3Terminada = v;
      render(); 
    },
    setClicked: (v) => { 
      localStorage.setItem("clicked", v); 
      clicked = v;
      render(); 
    },
  });
  wrapper.appendChild(contenedores);

  // --- Footer ---
  const footer = document.createElement("footer");
  footer.style.display = "flex";
  footer.style.flexDirection = "column";
  footer.style.alignItems = "center";
  footer.style.marginBottom = "40px";  

  const box = document.createElement("div");
  box.style.backgroundColor = "transparent";
  box.style.width = "250px";
  box.style.height = "70px";
  box.style.borderRadius = "100px";
  box.style.display = "flex";
  box.style.justifyContent = "center";
  box.style.alignItems = "center";
  box.style.marginBottom = "20px";  

  // --- BotonPrincipal ---
  const botonPrincipal = BotonPrincipal({
    clickCount,
    setClickCount: (v) => { 
      localStorage.setItem("clickCount", v); 
      clickCount = v; 
      render(); 
    },
    isProcessing: user.isProcessing || false,
    setIsProcessing: (v) => { user.isProcessing = v; },
    apartmentNumber: user.apartmentNumber,
    // 🔹 Inicia el temporizador al primer clic
    startCountdown: (t = 43200) => temporizador.startCountdown(t),
  });
  box.appendChild(botonPrincipal);

  // --- Botón cerrar sesión ---
  const btnLogout = document.createElement("button");
  btnLogout.textContent = "Cerrar 🔒";
  btnLogout.style.marginTop = "30px"; 
  btnLogout.style.padding = "6px";
  btnLogout.style.fontSize = "0.9rem";
  btnLogout.style.borderRadius = "5px";
  btnLogout.style.backgroundColor = "#f44336";
  btnLogout.style.color = "white";
  btnLogout.style.border = "none";
  btnLogout.style.cursor = "pointer";
  btnLogout.addEventListener("click", onLogout);

  footer.appendChild(box);
  footer.appendChild(btnLogout);
  wrapper.appendChild(footer);

  // --- Función para re-renderizar la página con los estados actualizados ---
  function render() {
    wrapper.innerHTML = "";
    wrapper.appendChild(title);

    if (clickCount > 0) wrapper.appendChild(timerBox);

    // re-render contenedores y footer
    const contenedoresActualizados = ContenedoresPaginaPrincipal({
      clickCount,
      factura1Terminada,
      factura2Terminada,
      factura3Terminada,
      clicked,
      setFactura1Terminada: (v) => { 
        localStorage.setItem("factura1Terminada", v); 
        factura1Terminada = v; 
        render(); 
      },
      setFactura2Terminada: (v) => { 
        localStorage.setItem("factura2Terminada", v); 
        factura2Terminada = v; 
        render(); 
      },
      setFactura3Terminada: (v) => { 
        localStorage.setItem("factura3Terminada", v); 
        factura3Terminada = v; 
        render(); 
      },
      setClicked: (v) => { 
        localStorage.setItem("clicked", v); 
        clicked = v; 
        render(); 
      },
    });
    wrapper.appendChild(contenedoresActualizados);
    wrapper.appendChild(footer);
  }

  return wrapper;
}
