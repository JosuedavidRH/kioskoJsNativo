// js/app.js
import { LoginPage } from "./pages/login.js";
import { RegisterPage } from "./pages/register.js";
import { HomePage } from "./pages/home.js";
import { SegundaPage } from "./pages/segunda.js";  // 🆕 Nueva página
import { temporizador } from "./temporizador.js";

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
      HomePage(currentUser, () => {
        currentUser = null;
        clickCount = 0;
        factura1Terminada = false;
        factura2Terminada = false;
        factura3Terminada = false;
        clicked = false;
        localStorage.clear();
        navigate("login");
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

// 🛑 Cierre automático
window.addEventListener("beforeunload", async () => {
  if (!currentUser) return;
  localStorage.clear();
});
