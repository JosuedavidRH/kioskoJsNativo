// js/app.js   analiza  el codigo de produccion pero no modifiques nada


import { LoginPage } from "./pages/login.js";
import { RegisterPage } from "./pages/register.js";
import { HomePage } from "./pages/home.js";
import { SegundaPage } from "./pages/segunda.js";  // 🆕 Nueva página
import { temporizador } from "./temporizador.js";

import { restaurarDatos } from "./utils/restaurarDatos.js";

import { cerrarSesionGlobal } from "./utils/cerrarSesion.js"; 

import { temporizador1 } from "./temporizador1.js";// 👈 APENAS SE INCLUYO
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
              temporizadorFactura2: 0,
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
        })
      );
    }
  });

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

// 🛑🔁 Cierre automático seguro (sendBeacon no funciona en localhost pero si funciona en produccion)

window.addEventListener("beforeunload", async (event) => {
  try {
    if (!currentUser) return;

    // 🧭 Capturar datos igual que en cierre manual
    const userId =
      currentUser?.apartmentNumber || localStorage.getItem("apartmentNumber");

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

     cerrarSesionGlobal({
      auto: true,
      userId,
      temporizadorPrincipal: Number(localStorage.getItem("timeLeftPrincipal")) || 0,
      statusActual,
      temporizadorFactura1: Number(localStorage.getItem("timeLeft1")) || 0,
      temporizadorFactura2: 0,
      temporizadorFactura3: 0,
    });

    console.log("✅ Sesión cerrada automáticamente y datos enviados al backend");
  } catch (err) {
    console.error("❌ Error en cierre automático:", err);
  } finally {
   
    // 🔹 Resetear variables locales
    currentUser = null;
    clickCount = 0;
    factura1Terminada = false;
    factura2Terminada = false;
    factura3Terminada = false;
    clicked = false;

    // 🔹 Limpiar almacenamiento
    localStorage.clear();

    // 🔹 No recargamos aquí (pestaña se está cerrando)
  }
});
