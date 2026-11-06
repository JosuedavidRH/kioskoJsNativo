// js/components/ContenedoresPaginaPrincipal.js  analiza  el codigo de produccion pero no modifiques nada


import { temporizadorfactura1 as TemporizadorFactura1 } from "../temporizadorfactura1.js";
import { temporizadorfactura2 as TemporizadorFactura2 } from "../temporizadorfactura2.js";
import { temporizador2 } from "../temporizador2.js";  
import { BotonPrincipal } from "../components/BotonPrincipal.js";
import { iniciarCompra } from "../utils/iniciarCompra.js";
import { restaurarDatos } from "../utils/restaurarDatos.js";

export function ContenedoresPaginaPrincipal({
  clickCount,
  factura1Terminada,
  factura2Terminada,
  factura3Terminada,
  setFactura1Terminada,
  setFactura2Terminada,
  setFactura3Terminada,
  clicked,
  setClicked,
  navigate,
  user,
}) {
  const fragment = document.createDocumentFragment();

  // 🔹 CONTENEDOR PRINCIPAL
  const contenedorCentral = document.createElement("div");
  contenedorCentral.style.display = "flex";
  contenedorCentral.style.flexDirection = "column";
  contenedorCentral.style.alignItems = "center";
  contenedorCentral.style.justifyContent = "center";
  contenedorCentral.style.gap = "20px";
  contenedorCentral.style.width = "100%";
  contenedorCentral.style.background = "transparent";
  
const variasFacturas = clickCount >= 2;
contenedorCentral.style.minHeight = variasFacturas ? "auto" : "100vh";
contenedorCentral.style.transform = variasFacturas ? "none" : "translateY(-150px)";
contenedorCentral.style.paddingBottom = variasFacturas ? "220px" : "0";


if (clickCount >= 1 || clickCount === -2) {

    // 🧾 Factura 1
    const bloqueFactura1 = document.createElement("div");
    bloqueFactura1.style.backgroundColor = "rgba(0,0,0,0.2)";
    bloqueFactura1.style.width = "150px";
    bloqueFactura1.style.height = "150px";
    bloqueFactura1.style.borderRadius = "12px";
    bloqueFactura1.style.display = "flex";
    bloqueFactura1.style.flexDirection = "column";
    bloqueFactura1.style.justifyContent = "center";
    bloqueFactura1.style.alignItems = "center";
    bloqueFactura1.style.position = "relative";
    bloqueFactura1.style.gap = "10px";

    // 🔴 / 🟡 Estados del temporizador
    if (factura1Terminada) {

      // ⛔ Si es usuario nuevo: NO detener temporizadores
      if (window.usuarioNuevo) {
        console.log("⛔ Usuario nuevo → NO detener temporizador1");
      } else {
        if (!window.temporizador1Detenido) {
          import("../temporizador1.js").then(({ temporizador1 }) => {
            try {
              temporizador1.stop();
              localStorage.removeItem("timeLeft1");
              console.log("🧾 Temporizador 1 detenido y limpiado");
            } catch (err) {
              console.warn("No se pudo detener temporizador1:", err);
            }
          });

          window.temporizador1Detenido = true;
        }
      }

      // 🔴 Estado: factura vencida
      const btnVencido = document.createElement("button");
      btnVencido.style.width = "110px";
      btnVencido.style.height = "110px";
      btnVencido.style.borderRadius = "50%";
      btnVencido.style.fontSize = "0.75rem";
      btnVencido.style.fontWeight = "bold";
      btnVencido.style.backgroundColor = "red";
      btnVencido.style.color = "white";
      btnVencido.style.border = "none";
      btnVencido.style.cursor = "pointer";
      btnVencido.style.display = "flex";
      btnVencido.style.justifyContent = "center";
      btnVencido.style.alignItems = "center";
      btnVencido.style.textAlign = "center";
      btnVencido.style.padding = "20px";

      btnVencido.textContent = "factura vencida";

      bloqueFactura1.appendChild(btnVencido);

    } else {

      // 🟡 Estado: esperando factura
      const contenedorEspera = document.createElement("div");
      contenedorEspera.style.display = "flex";
      contenedorEspera.style.flexDirection = "column";
      contenedorEspera.style.alignItems = "center";
      contenedorEspera.style.justifyContent = "center";
      contenedorEspera.style.gap = "8px";

      const btn = document.createElement("button");
      btn.style.width = "110px";
      btn.style.height = "110px";
      btn.style.borderRadius = "50%";
      btn.style.fontSize = "0.35rem";
      btn.style.backgroundColor = "#ff0";
      btn.style.color = "#000";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.justifyContent = "center";
      btn.style.alignItems = "center";
      btn.style.textAlign = "center";

      btn.addEventListener("click", () => {
        setClicked(!clicked);
      });

      // ⏱️ Temporizador original
      btn.appendChild(
        TemporizadorFactura1(() => setFactura1Terminada(true))
      );

      contenedorEspera.appendChild(btn);
      bloqueFactura1.appendChild(contenedorEspera);
    }

    // 🔹 TEXTO DEL PLAZO
    // Aparece mientras la factura NO esté vencida.
    if (!factura1Terminada) {

      const textoEspera = document.createElement("span");

      textoEspera.textContent =
        "TIENES 1 hora DE PLAZO PARA REALIZAR EL PAGO DE TUS COMPRAS REALIZADAS";

      textoEspera.style.color = "white";
      textoEspera.style.fontSize = "0.4rem";
      textoEspera.style.fontWeight = "500";
      textoEspera.style.textAlign = "center";

      bloqueFactura1.appendChild(textoEspera);
    }

    // 🟢 BOTÓN: REALIZAR OTRA COMPRA
    // NO aparece cuando clickCount es 2 o -2.
    if (
      !factura1Terminada &&
      clickCount !== 2 &&
      clickCount !== -2
    ) {

      const btnOtraCompra = document.createElement("button");
      btnOtraCompra.textContent = "REALIZAR OTRA COMPRA";

      btnOtraCompra.style.width = "110px";
      btnOtraCompra.style.height = "25px";
      btnOtraCompra.style.background =
        "linear-gradient(145deg, #22c55e, #15803d)";
      btnOtraCompra.style.color = "white";
      btnOtraCompra.style.fontWeight = "bold";
      btnOtraCompra.style.fontSize = "0.45rem";
      btnOtraCompra.style.border = "none";
      btnOtraCompra.style.borderRadius = "12px";
      btnOtraCompra.style.cursor = "pointer";
      btnOtraCompra.style.boxShadow = "0 5px 12px rgba(0,0,0,0.35)";
      btnOtraCompra.style.transition = "all 0.2s ease";
      btnOtraCompra.style.transform = "scale(1)";

      // ✨ Efecto al pasar el cursor
      btnOtraCompra.addEventListener("mouseenter", () => {
        btnOtraCompra.style.transform = "scale(1.06) translateY(-3px)";
        btnOtraCompra.style.boxShadow = "0 8px 18px rgba(0,0,0,0.4)";
        btnOtraCompra.style.background =
          "linear-gradient(145deg, #4ade80, #16a34a)";
      });

      // 🔹 Restaurar apariencia
      btnOtraCompra.addEventListener("mouseleave", () => {
        btnOtraCompra.style.transform = "scale(1)";
        btnOtraCompra.style.boxShadow = "0 5px 12px rgba(0,0,0,0.35)";
        btnOtraCompra.style.background =
          "linear-gradient(145deg, #22c55e, #15803d)";
      });

      // 👆 Efecto de pulsación
      btnOtraCompra.addEventListener("mousedown", () => {
        btnOtraCompra.style.transform = "scale(0.95)";
      });

      btnOtraCompra.addEventListener("mouseup", () => {
        btnOtraCompra.style.transform = "scale(1.06) translateY(-3px)";
      });

      btnOtraCompra.addEventListener("click", async () => {
        if (btnOtraCompra.disabled) return;

        const apartmentNumber =
          user?.apartmentNumber || localStorage.getItem("apartmentNumber");
        const textoOriginal = btnOtraCompra.textContent;

        btnOtraCompra.disabled = true;
        btnOtraCompra.style.opacity = 0.6;
        btnOtraCompra.textContent = "Generando…";

        try {
          await iniciarCompra({
            apartmentNumber,
            clickCount: Number(localStorage.getItem("clickCount")) || clickCount,
            navigate,
            destino: "tercera",
          });
        } catch (err) {
          console.error("❌ No se pudo iniciar la compra:", err);
          btnOtraCompra.disabled = false;
          btnOtraCompra.style.opacity = 1;
          btnOtraCompra.textContent = "Reintentar";
          setTimeout(() => (btnOtraCompra.textContent = textoOriginal), 2500);
        }
      });

      bloqueFactura1.appendChild(btnOtraCompra);
    }

    contenedorCentral.appendChild(bloqueFactura1);
}


    // 🔄 Reiniciar temporizador 2 una sola vez al llegar a clickCount 2
  if (clickCount === 2 && localStorage.getItem("factura2Reiniciada") !== "true") {
    localStorage.setItem("factura2Reiniciada", "true");
    window.temporizador2Detenido = false;

    temporizador2.reset(10800);   // vuelve a 60 y guarda timeLeft2
    temporizador2.start();

    // Si estaba marcada como vencida, quitarlo (diferido para no re-renderizar en pleno render)
    if (factura2Terminada) {
      setTimeout(() => setFactura2Terminada(false), 0);
    }
  }

 


  if (clickCount >= 2 || clickCount === -2) {

    // 🧾 Factura 2
    const bloqueFactura2 = document.createElement("div");
    bloqueFactura2.style.backgroundColor = "rgba(0,0,0,0.2)";
    bloqueFactura2.style.width = "150px";
    bloqueFactura2.style.height = "150px";
    bloqueFactura2.style.borderRadius = "12px";
    bloqueFactura2.style.display = "flex";
    bloqueFactura2.style.flexDirection = "column";
    bloqueFactura2.style.justifyContent = "center";
    bloqueFactura2.style.alignItems = "center";
    bloqueFactura2.style.position = "relative";
    bloqueFactura2.style.gap = "10px";

    // 🔴 / 🟡 Estados del temporizador
    if (factura2Terminada) {

      // ⛔ Si es usuario nuevo: NO detener temporizadores
      if (window.usuarioNuevo) {
        console.log("⛔ Usuario nuevo → NO detener temporizador2");
      } else {
        if (!window.temporizador2Detenido) {
          import("../temporizador2.js").then(({ temporizador2 }) => {
            try {
              temporizador2.stop();
              localStorage.removeItem("timeLeft2");
              console.log("🧾 Temporizador 2 detenido y limpiado");
            } catch (err) {
              console.warn("No se pudo detener temporizador2:", err);
            }
          });

          window.temporizador2Detenido = true;
        }
      }

      // 🔴 Estado: factura vencida
      const btnVencido2 = document.createElement("button");
      btnVencido2.style.width = "110px";
      btnVencido2.style.height = "110px";
      btnVencido2.style.borderRadius = "50%";
      btnVencido2.style.fontSize = "0.75rem";
      btnVencido2.style.fontWeight = "bold";
      btnVencido2.style.backgroundColor = "red";
      btnVencido2.style.color = "white";
      btnVencido2.style.border = "none";
      btnVencido2.style.cursor = "pointer";
      btnVencido2.style.display = "flex";
      btnVencido2.style.justifyContent = "center";
      btnVencido2.style.alignItems = "center";
      btnVencido2.style.textAlign = "center";
      btnVencido2.style.padding = "20px";

      btnVencido2.textContent = "factura vencida";

      bloqueFactura2.appendChild(btnVencido2);

    } else {

      // 🟡 Estado: esperando factura
      const contenedorEspera2 = document.createElement("div");
      contenedorEspera2.style.display = "flex";
      contenedorEspera2.style.flexDirection = "column";
      contenedorEspera2.style.alignItems = "center";
      contenedorEspera2.style.justifyContent = "center";
      contenedorEspera2.style.gap = "8px";

      const btn2 = document.createElement("button");
      btn2.style.width = "110px";
      btn2.style.height = "110px";
      btn2.style.borderRadius = "50%";
      btn2.style.fontSize = "0.35rem";
      btn2.style.backgroundColor = "#ff0";
      btn2.style.color = "#000";
      btn2.style.border = "none";
      btn2.style.cursor = "pointer";
      btn2.style.display = "flex";
      btn2.style.justifyContent = "center";
      btn2.style.alignItems = "center";
      btn2.style.textAlign = "center";

      btn2.addEventListener("click", () => {
        setClicked(!clicked);
      });

      // ⏱️ Temporizador factura 2
      btn2.appendChild(
        TemporizadorFactura2(() => setFactura2Terminada(true))
      );

      contenedorEspera2.appendChild(btn2);
      bloqueFactura2.appendChild(contenedorEspera2);
    }

    // 🔹 TEXTO DEL PLAZO Y BOTÓN VERDE
    // Ambos aparecen solamente mientras la factura NO esté vencida.
    if (!factura2Terminada) {

      // 🔹 Texto del plazo
      const textoEspera2 = document.createElement("span");

      textoEspera2.textContent =
        "TIENES 1 hora DE PLAZO PARA REALIZAR EL PAGO DE TUS COMPRAS REALIZADAS";

      textoEspera2.style.color = "white";
      textoEspera2.style.fontSize = "0.4rem";
      textoEspera2.style.fontWeight = "500";
      textoEspera2.style.textAlign = "center";

      bloqueFactura2.appendChild(textoEspera2);

      
    }

    contenedorCentral.appendChild(bloqueFactura2);
  }


  fragment.appendChild(contenedorCentral);
  return fragment;
}