// js/components/ContenedoresPaginaPrincipal.js  analiza  el codigo de produccion pero no modifiques nada


import { temporizadorfactura1 as TemporizadorFactura1 } from "../temporizadorfactura1.js";
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
  contenedorCentral.style.minHeight = "100vh";
  contenedorCentral.style.background = "transparent";
  contenedorCentral.style.transform = "translateY(-150px)";

  if (clickCount >= 1) {

    // 🧾 Factura 1
    const bloqueFactura1 = document.createElement("div");
    bloqueFactura1.style.backgroundColor = "rgba(0,0,0,0.2)";
    bloqueFactura1.style.width = "300px";
    bloqueFactura1.style.height = "300px";
    bloqueFactura1.style.borderRadius = "12px";
    bloqueFactura1.style.display = "flex";
    bloqueFactura1.style.flexDirection = "column";
    bloqueFactura1.style.justifyContent = "center";
    bloqueFactura1.style.alignItems = "center";
    bloqueFactura1.style.position = "relative";
    bloqueFactura1.style.gap = "10px";

    if (factura1Terminada) {

      // ⛔ Si es usuario nuevo: NO detener temporizadores ni marcar temporizador1Detenido
      if (window.usuarioNuevo) {
        console.log("⛔ Usuario nuevo → NO detener temporizador1");
      } else {
        // Solo detener si NO es usuario nuevo
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

      // 🔴 Estado: plazo vencido
      const btnVencido = document.createElement("button");
      btnVencido.style.width = "220px";
      btnVencido.style.height = "220px";
      btnVencido.style.borderRadius = "50%";
      btnVencido.style.fontSize = "1.5rem";
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

      btnVencido.textContent = "su plazo se vencio";

      bloqueFactura1.appendChild(btnVencido);

    } else {
      // ⏳ Estado: esperando factura
      const contenedorEspera = document.createElement("div");
      contenedorEspera.style.display = "flex";
      contenedorEspera.style.flexDirection = "column";
      contenedorEspera.style.alignItems = "center";
      contenedorEspera.style.justifyContent = "center";
      contenedorEspera.style.gap = "8px";

      // 🟡 Botón circular amarillo con temporizador
      const btn = document.createElement("button");
      btn.style.width = "220px";
      btn.style.height = "220px";
      btn.style.borderRadius = "50%";
      btn.style.fontSize = "0.7rem";
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

      // 🔹 Texto debajo del círculo
      const textoEspera = document.createElement("span");
      textoEspera.textContent =
        "TIENES 1 hora DE PLAZO PARA REALIZAR EL PAGO DE TUS COMPRAS REALIZADAS";
      textoEspera.style.color = "white";
      textoEspera.style.fontSize = "0.8rem";
      textoEspera.style.fontWeight = "500";
      textoEspera.style.textAlign = "center";

      contenedorEspera.appendChild(btn);
      contenedorEspera.appendChild(textoEspera);
      bloqueFactura1.appendChild(contenedorEspera);
    }

    contenedorCentral.appendChild(bloqueFactura1);
  }

  fragment.appendChild(contenedorCentral);
  return fragment;
}