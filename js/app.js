// js/app.js
import { LoginPage } from "./pages/login.js";
import { RegisterPage } from "./pages/register.js";
import { HomePage } from "./pages/home.js";
import { SegundaPage } from "./pages/segunda.js";  // 🆕 Nueva página
import { temporizador } from "./temporizador.js";
import { cerrarSesionGlobal } from "./utils/cerrarSesion.js"; // 👈 agrega esta línea arriba

import { temporizador2 } from "./temporizador2.js";
import { temporizador3 } from "./temporizador3.js";



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
  app.appendChild(
    HomePage(currentUser, async () => {
      try {
        // 🧭 Leer datos antes de limpiar o cerrar sesión
        const userId =
          currentUser?.apartmentNumber || localStorage.getItem("apartmentNumber");

        // Asegurar que el clickCount real se capture correctamente
        const storedClickCount = localStorage.getItem("clickCount");
        const statusActual =
          storedClickCount !== null
            ? Number(storedClickCount)
            : currentUser?.clickCount || 0;

        console.log("🧭 Datos antes de cerrar sesión:", {
          userId,
          clickCount: storedClickCount,
          timeLeftPrincipal: localStorage.getItem("timeLeftPrincipal"),
          timeLeft1: localStorage.getItem("timeLeft1"),
        });

        if (!userId) {
          console.warn("⚠️ cerrarSesionGlobal: userId no encontrado antes del envío");
        }

        // ✅ Llamar al cierre de sesión global (manual)
        await cerrarSesionGlobal({
          auto: false,
          userId,
          temporizadorPrincipal:
            Number(localStorage.getItem("timeLeftPrincipal")) || 0,
          statusActual, // ✅ clickCount real
          temporizadorFactura1: Number(localStorage.getItem("timeLeft1")) || 0,
          temporizadorFactura2: 0,
          temporizadorFactura3: 0,
        });

        console.log("✅ Sesión cerrada manualmente y datos enviados al backend");
      } catch (err) {
        console.error("❌ Error cerrando sesión manual:", err);
      } finally {
        // 🔹 Detener temporizadores activos
        if (temporizador?.stopCountdown) temporizador.stopCountdown();
        if (temporizador2?.stopCountdown) temporizador2.stopCountdown();
        if (temporizador3?.stopCountdown) temporizador3.stopCountdown();

        // 🔹 Resetear variables locales
        currentUser = null;
        clickCount = 0;
        factura1Terminada = false;
        factura2Terminada = false;
        factura3Terminada = false;
        clicked = false;

        // 🔹 Limpiar localStorage
        localStorage.clear();

        // 🔹 Recargar la app para evitar que cualquier listener vuelva a escribir datos
        window.location.reload();
      }
    })
  );
  return;
}


  // 🧩 SEGUNDA (nueva)
if (page === "segunda") {
  app.appendChild(
    SegundaPage({
      user: data.user,
      codigos: data.codigos,        // ✅ agrega esto
      indexActual: data.indexActual, // ✅ y esto
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

// 🛑 Cierre automático seguro
window.addEventListener("beforeunload", async () => {
  try {
    // Evitar limpiar datos locales durante navegación interna
    const isInternalNav = performance.getEntriesByType("navigation")[0]?.type === "reload";
    if (!isInternalNav) return;

    if (!currentUser) return;

    // Solo si realmente se está cerrando sesión o recargando manualmente
    localStorage.clear();
  } catch (err) {
    console.warn("beforeunload error:", err);
  }
});

