// js/components/ContenedoresPaginaPrincipal.js  analiza  el codigo de produccion pero no modifiques nada


import { temporizadorfactura1 as TemporizadorFactura1 } from "../temporizadorfactura1.js";

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
  contenedorCentral.style.transform = "translateY(-150px)"; // 🔹 sube el bloque

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
    bloqueFactura1.style.gap = "10px"; // espacio entre elementos

    if (factura1Terminada) {
      // ✅ Estado: factura lista
      const div = document.createElement("div");
      div.style.textAlign = "center";
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.alignItems = "center";
      div.style.gap = "10px";

      // 🖼️ Imagen superior cuando la factura está lista
      const imgFacturaLista = document.createElement("img");
      imgFacturaLista.src = "./public/factura.gif";
      imgFacturaLista.alt = "Factura lista";
      imgFacturaLista.style.width = "120px";
      imgFacturaLista.style.height = "120px";
      imgFacturaLista.style.marginBottom = "5px";

      const text = document.createElement("div");
      text.style.fontSize = "1rem";
      text.style.marginBottom = "8px";
      text.style.fontWeight = "bold";
      text.textContent = "YA ESTA lista tu factura ";

      const btn = document.createElement("button");
      btn.textContent = "VER";
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "10px";
      btn.style.padding = "10px 16px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "1.2rem";

      div.appendChild(imgFacturaLista); // 🔹 imagen agregada aquí
      div.appendChild(text);
      div.appendChild(btn);
      bloqueFactura1.appendChild(div);
    } else {
      // ⏳ Estado: esperando factura
      const contenedorEspera = document.createElement("div");
      contenedorEspera.style.display = "flex";
      contenedorEspera.style.flexDirection = "column";
      contenedorEspera.style.alignItems = "center";
      contenedorEspera.style.justifyContent = "center";
      contenedorEspera.style.gap = "8px";

      // 🔸 Botón circular amarillo con temporizador
      const btn = document.createElement("button");
      btn.style.width = "160px";
      btn.style.height = "160px";
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

      // Renderiza temporizador dentro del botón
      btn.appendChild(TemporizadorFactura1(() => setFactura1Terminada(true)));

      // 🔹 Texto debajo del círculo
      const textoEspera = document.createElement("span");
      textoEspera.textContent = "ESPERA TU FACTURA";
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



  

   
   