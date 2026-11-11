// js/pages/home.js   analiza  el codigo de produccion pero no modifiques nada



import { temporizador } from "../temporizador.js";
import { temporizador2 } from "../temporizador2.js";
import { temporizador3 } from "../temporizador3.js";

import { ContenedoresPaginaPrincipal } from "../components/ContenedoresPaginaPrincipal.js";
import { BotonPrincipal } from "../components/BotonPrincipal.js";
import { guardarStatusActual2_2 } from "../utils/guardarStatusActual2_2.js";

export function HomePage(user, onLogout, navigate) {
  const wrapper = document.createElement("div");
  wrapper.className = "home-container";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.minHeight = "100vh";
  wrapper.style.backgroundColor = "#282c34";
  wrapper.style.color = "white";
  wrapper.style.fontFamily = "Arial, sans-serif";
  wrapper.style.padding = "20px";
  wrapper.style.textAlign = "center";

  // --- Bienvenida ---
  const title = document.createElement("h2");
  title.textContent = `Bienvenido, Apto: ${user.apartmentNumber} (WhatsApp: ${user.username}) `;
  wrapper.appendChild(title);

  // 🔹 Leer estados desde localStorage para reflejar la vista real
  let clickCount = Number(localStorage.getItem("clickCount") || 0);
  console.log("🏠 HomePage renderizando con clickCount:", clickCount);
  guardarStatusActual2_2(user);
  let factura1Terminada = localStorage.getItem("factura1Terminada") === "true";
  let factura2Terminada = localStorage.getItem("factura2Terminada") === "true";
  let factura3Terminada = localStorage.getItem("factura3Terminada") === "true";
  let clicked = localStorage.getItem("clicked") === "true";

  // --- Temporizador principal ---
  const timerBox = document.createElement("div");
  timerBox.style.fontSize = "21px";
  timerBox.style.fontWeight = "bold";

  
 // 👇 solo se muestra si clickCount es mayor o igual a 0
if (clickCount >= 0 || clickCount === -2) {


    wrapper.appendChild(timerBox);

    // Función que actualiza la vista del temporizador
    function updateTimer() {
      timerBox.textContent = ` `;
    }

    // Actualización inicial
    updateTimer();

    // ✅ Evitar listeners duplicados
    if (!window.temporizadorListenerActivo) {
      temporizador.addEventListener("update", (e) => {
        //console.log(e.detail);
        const { timeLeft, fondoRojo } = e.detail;

        timerBox.textContent = ` ${temporizador.formatTimeLeft(timeLeft)}`;

        // 🎯 Control de visibilidad del texto
        if (clickCount === 0) {
          timerBox.style.color = "transparent";
        } else {
          timerBox.style.color = "white";
        }

        if (fondoRojo) {
          wrapper.style.backgroundColor = "red";
        }

        if (timeLeft === 0) {
          window.temporizadorListenerActivo = false;
          onLogout();
        }

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

    // 🔹 Datos para navegación a TerceraPage
    navigate,
    user,

    setFactura1Terminada: (v) => {
      if (window.usuarioNuevo) return;   // ⛔ No guardar nada
      localStorage.setItem("factura1Terminada", v);
      factura1Terminada = v;
      render();
    },

    setFactura2Terminada: (v) => {
      if (window.usuarioNuevo) return;   // ⛔ No guardar nada
      localStorage.setItem("factura2Terminada", v);
      factura2Terminada = v;
      render();
    },

    setFactura3Terminada: (v) => {
      if (window.usuarioNuevo) return;   // ⛔ No guardar nada
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

  // 🔹 Prioridad visual y recepción de clics
  footer.style.position = "relative";
  footer.style.zIndex = "1000";
  footer.style.pointerEvents = "auto";

  const box = document.createElement("div");
  box.style.backgroundColor = "transparent";
  box.style.width = "250px";
  box.style.height = "70px";
  box.style.borderRadius = "100px";
  box.style.display = "flex";
  box.style.justifyContent = "center";
  box.style.alignItems = "center";
  box.style.marginBottom = "0px";
  
  if (clickCount >= 2) {
  box.style.position = "fixed";
  box.style.bottom = "20px";
  box.style.left = "50%";
  box.style.transform = "translateX(-50%)";
} else {
  box.style.transform = "translateY(-300px)";
}

   
  // --- BotonPrincipal ---
  if (clickCount === 0) {
    const botonPrincipal = BotonPrincipal({
      clickCount,
      username: user.username,
      setClickCount: (v) => {
        localStorage.setItem("clickCount", v);
        clickCount = v;
        guardarStatusActual2_2(user);
        render();
      },
      isProcessing: user.isProcessing || false,
      setIsProcessing: (v) => { user.isProcessing = v; },
      apartmentNumber: user.apartmentNumber,
      // 🔹 Inicia el temporizador al primer clic
      startCountdown: (t = 120) => temporizador.startCountdown(t),

      // 🔒 Se ejecuta cuando COMPRAR se bloquea (statusActual = 1 o no verificado)
      onLogout: () => {
        window.temporizadorListenerActivo = false;
        onLogout();
      },
    });
    box.appendChild(botonPrincipal);
  }

  footer.appendChild(box);

  // --- Botón cerrar sesión ---
    if (clickCount === 0 || clickCount === 1 || clickCount === 2 || clickCount === -2) {
      const btnLogout = document.createElement("button");
      btnLogout.textContent = "Cerrar 🔒";

      btnLogout.style.padding = "8px 14px";
      btnLogout.style.fontSize = "0.9rem";
      btnLogout.style.borderRadius = "8px";
      btnLogout.style.color = "white";
      btnLogout.style.border = "none";
      btnLogout.style.cursor = "pointer";

      // 🔹 Garantizar que el botón reciba los clics
      btnLogout.style.position = "relative";
      btnLogout.style.zIndex = "1001";
      btnLogout.style.pointerEvents = "auto";
      btnLogout.style.transition = "all 0.2s ease";
      btnLogout.style.fontWeight = "bold";
      btnLogout.style.boxShadow = "0 3px 8px rgba(0,0,0,0.25)";
      btnLogout.style.transform = "scale(1)";

      // 🎯 Fondo + texto según estado
      if (clickCount === 0 || clickCount === -2) {
        btnLogout.style.backgroundColor = "#d32f2f";
        btnLogout.style.color = "scale(1.08) translateY(-2px)";
        btnLogout.style.boxShadow = "0 6px 14px rgba(0,0,0,0.35)";
      } else {
        btnLogout.style.backgroundColor = "#f44336";
        btnLogout.style.color = "white";
      }

      // ✨ Efecto al pasar el cursor
      btnLogout.addEventListener("mouseenter", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.backgroundColor = "#d32f2f";
          btnLogout.style.transform = "scale(1.08) translateY(-2px)";
          btnLogout.style.boxShadow = "0 6px 14px rgba(0,0,0,0.35)";
        }
      });

      // 🔹 Restaurar apariencia
      btnLogout.addEventListener("mouseleave", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.backgroundColor = "#f44336";
          btnLogout.style.transform = "scale(1)";
          btnLogout.style.boxShadow = "0 3px 8px rgba(0,0,0,0.25)";
        }
      });

      // 👆 Efecto al presionar
      btnLogout.addEventListener("mousedown", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.transform = "scale(0.94)";
        }
      });

      btnLogout.addEventListener("mouseup", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.transform = "scale(1.08) translateY(-2px)";
        }
      });


    // 🧹 Limpia bandera al cerrar sesión
    btnLogout.addEventListener("click", () => {
      window.temporizadorListenerActivo = false;
      onLogout();
    });

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

      // 🔹 Mantener navegación después de cada render
      navigate,
      user,

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

    // 🔹 Mantener prioridad visual después del render
    footerActualizado.style.position = "relative";
    footerActualizado.style.zIndex = "1000";
    footerActualizado.style.pointerEvents = "auto";

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

    // --- BotonPrincipal nuevamente ---
    if (clickCount === 0) {
      const botonPrincipal = BotonPrincipal({
        clickCount,
        username: user.username,
        setClickCount: (v) => {
          localStorage.setItem("clickCount", v);
          clickCount = v;
          guardarStatusActual2_2(user);
          render();
        },
        isProcessing: user.isProcessing || false,
        setIsProcessing: (v) => { user.isProcessing = v; },
        apartmentNumber: user.apartmentNumber,
        // 🔹 Inicia el temporizador al primer clic
        startCountdown: (t = 120) => temporizador.startCountdown(t),

        // 🔒 Se ejecuta cuando COMPRAR se bloquea (statusActual = 1 o no verificado)
        onLogout: () => {
          window.temporizadorListenerActivo = false;
          onLogout();
        },
      });
      boxActualizado.appendChild(botonPrincipal);
    }

    footerActualizado.appendChild(boxActualizado);

           // --- Botón cerrar sesión ---
    if (clickCount === 0 || clickCount === 1 || clickCount === 2 || clickCount === -2) {
      const btnLogout = document.createElement("button");
      btnLogout.textContent = "Cerrar 🔒";

      btnLogout.style.padding = "8px 14px";
      btnLogout.style.fontSize = "0.9rem";
      btnLogout.style.borderRadius = "8px";
      btnLogout.style.color = "white";
      btnLogout.style.border = "none";
      btnLogout.style.cursor = "pointer";

      // 🔹 Garantizar que el botón reciba los clics
      btnLogout.style.position = "relative";
      btnLogout.style.zIndex = "1001";
      btnLogout.style.pointerEvents = "auto";
      btnLogout.style.transition = "all 0.2s ease";
      btnLogout.style.fontWeight = "bold";
      btnLogout.style.boxShadow = "0 3px 8px rgba(0,0,0,0.25)";
      btnLogout.style.transform = "scale(1)";
     

     // 🎯 Fondo + texto según estado
      if (clickCount === 0 || clickCount === -2) {
        btnLogout.style.backgroundColor = "#d32f2f";
        btnLogout.style.color = "scale(1.08) translateY(-2px)";
        btnLogout.style.boxShadow = "0 6px 14px rgba(0,0,0,0.35)";
      } else {
        btnLogout.style.backgroundColor = "#f44336";
        btnLogout.style.color = "white";
      }


      // ✨ Efecto al pasar el cursor
      btnLogout.addEventListener("mouseenter", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.backgroundColor = "#d32f2f";
          btnLogout.style.transform = "scale(1.08) translateY(-2px)";
          btnLogout.style.boxShadow = "0 6px 14px rgba(0,0,0,0.35)";
        }
      });

      // 🔹 Restaurar apariencia
      btnLogout.addEventListener("mouseleave", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.backgroundColor = "#f44336";
          btnLogout.style.transform = "scale(1)";
          btnLogout.style.boxShadow = "0 3px 8px rgba(0,0,0,0.25)";
        }
      });

      // 👆 Efecto al presionar
      btnLogout.addEventListener("mousedown", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.transform = "scale(0.94)";
        }
      });

      btnLogout.addEventListener("mouseup", () => {
        if (clickCount >= 0 || clickCount === -2) {
          btnLogout.style.transform = "scale(1.08) translateY(-2px)";
        }
      });

      // 🧹 Limpia bandera al cerrar sesión
      btnLogout.addEventListener("click", () => {
        window.temporizadorListenerActivo = false;
        onLogout();
      });

      btnLogout.style.marginTop = "-240px";
      footerActualizado.appendChild(btnLogout);
    }

    
    wrapper.appendChild(footerActualizado);
  }

  return wrapper;
}