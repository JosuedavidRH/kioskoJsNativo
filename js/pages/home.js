// js/pages/home.js   analiza  el codigo de produccion pero no modifiques nada

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
  console.log("🏠 HomePage renderizando con clickCount:", clickCount);
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

    // ✅ Evitar listeners duplicados
    if (!window.temporizadorListenerActivo) {
      temporizador.addEventListener("update", (e) => {
        const { timeLeft } = e.detail;
        timerBox.textContent = `PLAZO DE PAGO ${temporizador.formatTimeLeft(timeLeft)}`;
      });
      window.temporizadorListenerActivo = true;
    }

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
  footer.style.marginBottom = "10px";  

  const box = document.createElement("div");
  box.style.backgroundColor = "transparent";
  box.style.width = "250px";
  box.style.height = "70px";
  box.style.borderRadius = "100px";
  box.style.display = "flex";
  box.style.justifyContent = "center";
  box.style.alignItems = "center";
  box.style.marginBottom = "0px"; 
  box.style.transform = "translateY(-300px)";

  // --- BotonPrincipal ---
  if (clickCount !== 1) {
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
  }

  footer.appendChild(box);

  // --- Botón cerrar sesión ---
  if (clickCount === 1) {
    const btnLogout = document.createElement("button");
    btnLogout.textContent = "Cerrar 🔒";

    btnLogout.style.padding = "6px";
    btnLogout.style.fontSize = "0.9rem";
    btnLogout.style.borderRadius = "5px";
    btnLogout.style.backgroundColor = "#f44336";
    btnLogout.style.color = "white";
    btnLogout.style.border = "none";
    btnLogout.style.cursor = "pointer";
    btnLogout.addEventListener("click", onLogout);
    btnLogout.style.marginTop = "-240px";

    footer.appendChild(btnLogout);
  }

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

    const footerActualizado = document.createElement("footer");
    footerActualizado.style.display = "flex";
    footerActualizado.style.flexDirection = "column";
    footerActualizado.style.alignItems = "center";
    footerActualizado.style.marginBottom = "10px";

    const boxActualizado = document.createElement("div");
    boxActualizado.style.backgroundColor = "transparent";
    boxActualizado.style.width = "250px";
    boxActualizado.style.height = "70px";
    boxActualizado.style.borderRadius = "100px";
    boxActualizado.style.display = "flex";
    boxActualizado.style.justifyContent = "center";
    boxActualizado.style.alignItems = "center";
    boxActualizado.style.marginBottom = "0px";
    boxActualizado.style.transform = "translateY(-300px)";

    // --- Botón principal nuevamente ---
    if (clickCount !== 1) {
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
        startCountdown: (t = 43200) => temporizador.startCountdown(t),
      });
      boxActualizado.appendChild(botonPrincipal);
    }

    footerActualizado.appendChild(boxActualizado);

    // --- Mostrar botón cerrar sesión solo si clickCount === 1 ---
    if (clickCount === 1) {
      const btnLogout = document.createElement("button");
      btnLogout.textContent = "Cerrar 🔒";

      btnLogout.style.padding = "6px";
      btnLogout.style.fontSize = "0.9rem";
      btnLogout.style.borderRadius = "5px";
      btnLogout.style.backgroundColor = "#f44336";
      btnLogout.style.color = "white";
      btnLogout.style.border = "none";
      btnLogout.style.cursor = "pointer";
      btnLogout.addEventListener("click", onLogout);
      btnLogout.style.marginTop = "-240px";

      footerActualizado.appendChild(btnLogout);
    }

    wrapper.appendChild(footerActualizado);
  }

  return wrapper;
}
