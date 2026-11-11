// js/app.js   analiza  el codigo de produccion pero no modifiques nada


import { LoginPage } from "./pages/login.js";
import { RegisterPage } from "./pages/register.js";
import { HomePage } from "./pages/home.js";
import { SegundaPage } from "./pages/segunda.js";  
import { TerceraPage } from "./pages/tercera.js";  // 🆕 Nueva página
import { temporizador } from "./temporizador.js";

import { restaurarDatos } from "./utils/restaurarDatos.js";

import { cerrarSesionGlobal } from "./utils/cerrarSesion.js"; 

import { temporizador1 } from "./temporizador1.js";
import { temporizador2 } from "./temporizador2.js";
import { temporizador3 } from "./temporizador3.js";


import { guardarStatusActual0 } from "./utils/guardarStatusActual0.js";
import { guardarStatusActual } from "./utils/guardarStatusActual.js";
import { guardarStatusActual2 } from "./utils/guardarStatusActual2.js";

import { enviarWhatsApp } from "./utils/enviarWhatsApp.js";




const app = document.getElementById("app");

// 🔹 Estado global
let currentUser = null;
let clickCount = Number(localStorage.getItem("clickCount") || 0);
let factura1Terminada = localStorage.getItem("factura1Terminada") === "true";
let factura2Terminada = localStorage.getItem("factura2Terminada") === "true";
let factura3Terminada = localStorage.getItem("factura3Terminada") === "true";
let clicked = localStorage.getItem("clicked") === "true";

// 🟢 Navegación principal unificada
export function navigate(page, data = {}) {
  app.innerHTML = "";

  // 🧩 LOGIN
  if (page === "login") {
    app.appendChild(
      LoginPage(
        (user) => {
          currentUser = {
            username: user.username,
            apartmentNumber: user.apartmentNumber,
            clickCount,
            factura1Terminada,
            factura2Terminada,
            factura3Terminada,
            clicked,
            setFactura1Terminada: (v) => {
              factura1Terminada = v;
              localStorage.setItem("factura1Terminada", v);
            },
            setFactura2Terminada: (v) => {
              factura2Terminada = v;
              localStorage.setItem("factura2Terminada", v);
            },
            setFactura3Terminada: (v) => {
              factura3Terminada = v;
              localStorage.setItem("factura3Terminada", v);
            },
            setClicked: (v) => {
              clicked = v;
              localStorage.setItem("clicked", v);
            },
            setClickCount: (v) => {
              clickCount = v;
              localStorage.setItem("clickCount", v);
            },
          };
          localStorage.setItem("user", user.username);
          localStorage.setItem("apartmentNumber", user.apartmentNumber);
          navigate("home");
        },
        () => navigate("register")
      )
    );
    return;
  }

  // 🧩 REGISTER
  if (page === "register") {
    app.appendChild(
      RegisterPage(
        () => navigate("login"),
        (user) => {
          currentUser = {
            username: user.username,
            apartmentNumber: user.apartmentNumber,
            clickCount,
            factura1Terminada,
            factura2Terminada,
            factura3Terminada,
            clicked,
            setFactura1Terminada: (v) => {
              factura1Terminada = v;
              localStorage.setItem("factura1Terminada", v);
            },
            setFactura2Terminada: (v) => {
              factura2Terminada = v;
              localStorage.setItem("factura2Terminada", v);
            },
            setFactura3Terminada: (v) => {
              factura3Terminada = v;
              localStorage.setItem("factura3Terminada", v);
            },
            setClicked: (v) => {
              clicked = v;
              localStorage.setItem("clicked", v);
            },
            setClickCount: (v) => {
              clickCount = v;
              localStorage.setItem("clickCount", v);
            },
          };
          localStorage.setItem("user", user.username);
          localStorage.setItem("apartmentNumber", user.apartmentNumber);
          navigate("home");
        }
      )
    );
    return;
  }


// 🧩 HOME
if (page === "home") {
  const apartmentNumber = currentUser?.apartmentNumber || localStorage.getItem("apartmentNumber");

  // ✅ Restaurar datos desde backend primero
  restaurarDatos({
    apartmentNumber,

    // 🔹 Temporizador principal
    onTimeLeftChange: (v) => {
      console.log("🕒 Tiempo principal restaurado:", v);
      localStorage.setItem("timeLeftPrincipal", v);
      if (temporizador?.setTimeLeft) temporizador.setTimeLeft(v);
    },
    onFondoRojoChange: (v) => {
      document.body.classList.toggle("fondo-rojo", v);
    },
    onClickCountChange: (v) => {
      clickCount = v;
      localStorage.setItem("clickCount", v);
    },
    restart: (exp, activo) => {
      if (temporizador?.restartCountdown) temporizador.restartCountdown(exp, activo);
    },


   // 🔹 Factura 1 -> temporizador1
    onTimeLeftFactura1Change: (v) => {
  localStorage.setItem("timeLeft1", v);
  temporizador1.setTimeLeft(v); // ✅ ahora arranca automáticamente si v > 0
},


    // 🔹 Factura 2 -> temporizador2
    onTimeLeftFactura2Change: (v) => {
      localStorage.setItem("timeLeft2", v);
      if (temporizador2?.setTimeLeft) temporizador2.setTimeLeft(v);
    },
    startFactura2: (v) => temporizador2?.startCountdown?.(v),

    // 🔹 Factura 3 -> temporizador3
    onTimeLeftFactura3Change: (v) => {
      localStorage.setItem("timeLeft3", v);
      if (temporizador3?.setTimeLeft) temporizador3.setTimeLeft(v);
    },
    startFactura3: (v) => temporizador3?.startCountdown?.(v),

     // 🔹 Callback al terminar restauración: renderizar HomePage
onRestauracionCompleta: () => {
  app.appendChild(
    HomePage(currentUser, async () => {

      try {
        const userId = currentUser?.apartmentNumber || localStorage.getItem("apartmentNumber");
        const storedClickCount = localStorage.getItem("clickCount");
        const statusActual = storedClickCount !== null
          ? Number(storedClickCount)
          : currentUser?.clickCount || 0;

        console.log("🧭 Datos antes de cerrar sesión:", {
          userId,
          clickCount: storedClickCount,
          timeLeftPrincipal: localStorage.getItem("timeLeftPrincipal"),
          timeLeft1: localStorage.getItem("timeLeft1"),
        });

        await cerrarSesionGlobal({
          auto: false,
          userId,
          temporizadorPrincipal: Number(localStorage.getItem("timeLeftPrincipal")) || 0,
          statusActual,
          temporizadorFactura1: Number(localStorage.getItem("timeLeft1")) || 0,
          temporizadorFactura2: Number(localStorage.getItem("timeLeft2")) || 0,
          temporizadorFactura3: 0,
        });

        console.log("✅ Sesión cerrada manualmente y datos enviados al backend");
      } catch (err) {
        console.error("❌ Error cerrando sesión manual:", err);
      } finally {
        if (temporizador?.stopCountdown) temporizador.stopCountdown();
        if (temporizador1?.stopCountdown) temporizador1.stopCountdown();

        currentUser = null;
        clickCount = 0;
        factura1Terminada = false;
        factura2Terminada = false;
        factura3Terminada = false;
        clicked = false;

        localStorage.clear();
        window.location.reload();
      }
    }, navigate)
  );
}

});
  return;
}



  
if (page === "segunda") {
  app.appendChild(
    SegundaPage({
      user: data.user,
      codigos: data.codigos,       
      indexActual: data.indexActual,
      navigate,
    })
  );
  return;
 }



 // 🧩 TERCERA (nueva)
if (page === "tercera") {
  app.appendChild(
    TerceraPage({
      user: data.user,
      codigos: data.codigos,        
      indexActual: data.indexActual, 
      navigate,
    })
  );
  return;
 }
}



// 🔐 Inicialización
window.onload = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    currentUser = {
      username: savedUser,
      apartmentNumber: localStorage.getItem("apartmentNumber"),
      clickCount,
      factura1Terminada,
      factura2Terminada,
      factura3Terminada,
      clicked,
      setFactura1Terminada: (v) => {
        factura1Terminada = v;
        localStorage.setItem("factura1Terminada", v);
      },
      setFactura2Terminada: (v) => {
        factura2Terminada = v;
        localStorage.setItem("factura2Terminada", v);
      },
      setFactura3Terminada: (v) => {
        factura3Terminada = v;
        localStorage.setItem("factura3Terminada", v);
      },
      setClicked: (v) => {
        clicked = v;
        localStorage.setItem("clicked", v);
      },
      setClickCount: (v) => {
        clickCount = v;
        localStorage.setItem("clickCount", v);
      },
    };
    navigate("home");
  } else {
    navigate("login");
  }
};




// --- ✅ Función para obtener número de WhatsApp
function obtenerNumeroUsuario() {
  let numero = localStorage.getItem("user") || currentUser?.user || currentUser?.username;
  if (numero && !numero.startsWith("+")) {
    numero = "+57" + numero;
  }
  return numero;
}



 // ----------------------------------------------------------------------------------------------------------

    // 🛑🔁 Cierre automático seguro (version PRODUCCION ) NOTA: navigator.sendBeacon SI FUNCIONA EN "PRODUCCION"

     // --------------------------------------------------------------------------------------------------------------

window.addEventListener("beforeunload", async (event) => {
  try {
    if (!currentUser) return;

    // ⚠️ Aviso de salida
    event.preventDefault();
    event.returnValue = "¿Seguro que quieres salir? Los datos podrían perderse.";

    // 🧭 Datos del usuario
    const userId =
      currentUser?.apartmentNumber || localStorage.getItem("apartmentNumber");

    const apartmentNumber = userId;

    const storedClickCount = localStorage.getItem("clickCount");
    const statusActual =
      storedClickCount !== null
        ? Number(storedClickCount)
        : currentUser?.clickCount || 0;

    console.log("⚙️ Cierre automático detectado (beforeunload):", {
      userId,
      clickCount: storedClickCount,
      timeLeftPrincipal: localStorage.getItem("timeLeftPrincipal"),
      timeLeft1: localStorage.getItem("timeLeft1"),
    });

    // 🔹 1️⃣ Consultar el backend
    const response = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    // ClickCount real
    const clickCountActual = Number(localStorage.getItem("clickCount")) || 0;



    // ───────────────────────────────────────────────
    // 🔸 CASO 1 — NO HAY CÓDIGOS → clickCount = 1
    // ───────────────────────────────────────────────
    if (
      (!data.success || !data.data || data.data.length === 0) && 
      clickCountActual === 1
    ) {
      console.log("⚪ No hay códigos activos → HOME clickCount = 1");
      localStorage.setItem("clickCount", "1");

      // ⭐ Obtener número real del usuario
      const userPhone = obtenerNumeroUsuario();
      console.log("📞 Número capturado para WhatsApp:", userPhone);

      try {
        if (apartmentNumber) {
          console.log("📤 Enviando guardarStatusActual(1) con apartmentNumber:", apartmentNumber);

          // ❗ NO usar await en beforeunload → se lanza sin esperar
          guardarStatusActual(1, apartmentNumber);

          // 🟢 Enviar WhatsApp sin await (flujo normal)
          if (userPhone) {
            console.log("📨 Enviando notificación WhatsApp al usuario...");
            enviarWhatsApp(userPhone);
            console.log("🟢 Llamado enviarWhatsApp ejecutado");
          } else {
            console.warn("⚠️ No se encontró el número del usuario en localStorage");
          }

          // ⭐⭐ BACKUP sendBeacon — para garantizar envío en cierre
          const beaconPayload = JSON.stringify({
            to: userPhone
          });

          const blob = new Blob([beaconPayload], { type: "application/json" });

          const beaconOk = navigator.sendBeacon(
            "https://backend-1uwd.onrender.com/api/enviar-factura-whatsapp",
            blob
          );

          console.log("🟡 Backup sendBeacon →", beaconOk ? "OK" : "FALLÓ");

        } else {
          console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual=1");
        }
      } catch (err) {
        console.error("❌ Error en guardarStatusActual(1) o WhatsApp:", err);
      }

    } else {
      console.log("🚫 No se cumple CASO 1");
    }



    // ───────────────────────────────────────────────
    // 🔸 CASO 2 — HAY CÓDIGO DE 6 DÍGITOS → clickCount = 0
    // ───────────────────────────────────────────────
    const codigo = data.data?.[0]?.codigo_qr;

    if (codigo && /^\d{6}$/.test(codigo) && clickCountActual === 1) {
      console.log("🟢 Código detectado:", codigo, "→ HOME clickCount = 0");
      localStorage.setItem("clickCount", "0");

      console.log("🟡 Llamando guardarStatusActual0 (código válido)");

      const payload0 = JSON.stringify({
        userId: apartmentNumber,
        statusActual: 0,
      });

      if (location.hostname !== "localhost") {
        navigator.sendBeacon(
          "https://backend-1uwd.onrender.com/api/realTime/statusActual",
          new Blob([payload0], { type: "application/json" })
        );
        console.log("📡 sendBeacon statusActual=0 enviado");
      } else {
        guardarStatusActual0(apartmentNumber); // sin await
      }

    } else {
      console.log("🚫 No se cumple CASO 2");
    }

    
     
    // -------- condicionales  tercera.js  -------------------------------
   
    // 🔸 Caso 1 tercera.js : sin códigos → HOME clickCount = 2 
    if (
      (!data.success || !data.data || data.data.length === 0) && 
      clickCountActual === 2
    ) {
      console.log("⚪ No hay códigos activos → HOME clickCount = 2");
      localStorage.setItem("clickCount", "2");

      // ⭐ Obtener número real del usuario
      const userPhone = obtenerNumeroUsuario();
      console.log("📞 Número capturado para WhatsApp:", userPhone);

      try {
        if (apartmentNumber) {
          console.log("📤 Enviando guardarStatusActual2 (-2) con apartmentNumber:", apartmentNumber);

          // ❗ NO usar await en beforeunload → se lanza sin esperar
          guardarStatusActual2(-2, apartmentNumber);

          // 🟢 Enviar WhatsApp sin await (flujo normal)
          if (userPhone) {
            console.log("📨 Enviando notificación WhatsApp al usuario...");
            enviarWhatsApp(userPhone);
            console.log("🟢 Llamado enviarWhatsApp ejecutado");
          } else {
            console.warn("⚠️ No se encontró el número del usuario en localStorage");
          }

          // ⭐⭐ BACKUP sendBeacon — para garantizar envío en cierre
          const beaconPayload = JSON.stringify({
            to: userPhone
          });

          const blob = new Blob([beaconPayload], { type: "application/json" });

          const beaconOk = navigator.sendBeacon(
            "https://backend-1uwd.onrender.com/api/enviar-factura-whatsapp",
            blob
          );

          console.log("🟡 Backup sendBeacon →", beaconOk ? "OK" : "FALLÓ");

        } else {
          console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual=2");
        }
      } catch (err) {
        console.error("❌ Error en guardarStatusActual2(-2) o WhatsApp:", err);
      }

    } else {
      console.log("🚫 No se cumple CASO 1");
    }



    // 🔸 Caso 2 tercera.js : hay código de 6 dígitos → HOME clickCount = 1 (solo si clickCount > 1)
    
    if (codigo && /^\d{6}$/.test(codigo) && clickCountActual === 2) {
      console.log("🟢 Código válido detectado:", codigo, "→ HOME clickCount = 1");
      localStorage.setItem("clickCount", "1");
      localStorage.setItem("omitirRestauracionUnaVez", "1"); // 🛑 evita restaurarDatos al volver a HOME

      console.log("🟡 Llamando guardarStatusActual...");

      if (location.hostname !== "localhost") {
        const payload1 = JSON.stringify({ userId: apartmentNumber, statusActual: 1 });
        navigator.sendBeacon(
          "https://backend-1uwd.onrender.com/api/realTime/statusActual",
          new Blob([payload1], { type: "application/json" })
        );
        console.log("📡 Enviado con sendBeacon (statusActual=1)");
      } else {
        await guardarStatusActual(1, apartmentNumber);
      }
    }


    // 🔹 Cierre global de sesión (NO usar await)
    cerrarSesionGlobal({
      auto: true,
      userId,
      temporizadorPrincipal: Number(localStorage.getItem("timeLeftPrincipal")) || 0,
      statusActual,
      temporizadorFactura1: Number(localStorage.getItem("timeLeft1")) || 0,
      temporizadorFactura2: Number(localStorage.getItem("timeLeft2")) || 0,
      temporizadorFactura3: 0,
    });

    console.log("🟢 cerrarSesionGlobal() lanzado");

  } catch (err) {
    console.error("❌ Error en cierre automático:", err);
  } finally {
    // 🔹 Reset variables
    currentUser = null;
    clickCount = 0;
    factura1Terminada = false;
    factura2Terminada = false;
    factura3Terminada = false;
    clicked = false;

    // 🔹 limpiar localStorage
    localStorage.clear();
  }
});
