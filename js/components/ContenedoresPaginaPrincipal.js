// js/components/ContenedoresPaginaPrincipal.js



import { temporizadorfactura1 as TemporizadorFactura1 } from "../temporizadorfactura1.js";

import { temporizadorfactura2 as TemporizadorFactura2 } from "../temporizadorfactura2.js";
import { temporizadorfactura3 as TemporizadorFactura3 } from "../temporizadorfactura3.js";

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

  // ⏰ Mensaje ESPERA TUS FACTURAS
  if (clickCount >= 1) {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.transform = "translateY(-15px)";
    header.style.marginLeft = "160px";

    const div = document.createElement("div");
    div.style.backgroundColor = "transparent";
    div.style.width = "170px";
    div.style.height = "60px";
    div.style.borderRadius = "12px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    const span = document.createElement("span");
    span.style.fontSize = "0.7rem";
    span.style.color = "white";
    span.textContent = "ESPERA TUS FACTURAS";

    div.appendChild(span);
    header.appendChild(div);
    fragment.appendChild(header);
  }

  // 🧾 Bloque facturas pendientes
  if (clickCount >= 1) {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.transform = "translateY(-50px)";
    header.style.marginLeft = "-210px";

    const div = document.createElement("div");
    div.style.backgroundColor = "rgba(0,0,0,0.2)";
    div.style.width = "170px";
    div.style.height = "200px";
    div.style.borderRadius = "12px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    const img = document.createElement("img");
    img.src = "./public/compras.png";
    img.alt = "Compras";
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.marginBottom = "5px";

    const span = document.createElement("span");
    span.style.fontSize = "0.8rem";
    span.style.color = "white";
    span.innerHTML = `HAY <span style="font-size:2rem;font-weight:bold">${clickCount}</span> FACTURAS por valor de ;`;

    div.appendChild(img);
    div.appendChild(span);
    header.appendChild(div);
    fragment.appendChild(header);
  }

  // ✅ Factura 1
  if (clickCount >= 1) {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.transform = "translateY(-210px)";
    header.style.marginLeft = "170px";

    const box = document.createElement("div");
    box.style.backgroundColor = "rgba(0,0,0,0.2)";
    box.style.width = "200px";
    box.style.height = "120px";
    box.style.borderRadius = "12px";
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.alignItems = "center";

    if (factura1Terminada) {
      const div = document.createElement("div");
      div.style.textAlign = "center";

      const text = document.createElement("div");
      text.style.fontSize = "0.9rem";
      text.style.marginBottom = "8px";
      text.style.fontWeight = "bold";
      text.textContent = "lista tu factura 1 valor;";

      const btn = document.createElement("button");
      btn.textContent = "pagar";
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "10px";
      btn.style.padding = "10px 16px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "1.3rem";

      div.appendChild(text);
      div.appendChild(btn);
      box.appendChild(div);
    } else {
      const btn = document.createElement("button");
      btn.style.width = "70px";
      btn.style.height = "70px";
      btn.style.borderRadius = "50%";
      btn.style.fontSize = "0.6rem";
      btn.style.backgroundColor = "#ff0";
      btn.style.color = "#000";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.justifyContent = "center";
      btn.style.alignItems = "center";
      btn.style.textAlign = "center";

      btn.addEventListener("click", () => setClicked(!clicked));

      // Inyectamos el temporizador
      btn.appendChild(
        TemporizadorFactura1(() => setFactura1Terminada(true))
      );

      box.appendChild(btn);
    }

    header.appendChild(box);
    fragment.appendChild(header);
  }

  // ✅ Factura 2
  if (clickCount >= 2) {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.transform = "translateY(-200px)";
    header.style.marginLeft = "170px";

    const box = document.createElement("div");
    box.style.backgroundColor = "rgba(0,0,0,0.2)";
    box.style.width = "200px";
    box.style.height = "120px";
    box.style.borderRadius = "12px";
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.alignItems = "center";

    if (factura2Terminada) {
      const div = document.createElement("div");
      div.style.textAlign = "center";

      const text = document.createElement("div");
      text.style.fontSize = "0.9rem";
      text.style.marginBottom = "8px";
      text.style.fontWeight = "bold";
      text.textContent = "lista tu factura 2 valor;";

      const btn = document.createElement("button");
      btn.textContent = "pagar";
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "10px";
      btn.style.padding = "10px 16px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "1.3rem";

      div.appendChild(text);
      div.appendChild(btn);
      box.appendChild(div);
    } else {
      const btn = document.createElement("button");
      btn.style.width = "70px";
      btn.style.height = "70px";
      btn.style.borderRadius = "50%";
      btn.style.fontSize = "0.6rem";
      btn.style.backgroundColor = "#ff0";
      btn.style.color = "#000";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.justifyContent = "center";
      btn.style.alignItems = "center";
      btn.style.textAlign = "center";

      btn.addEventListener("click", () => setClicked(!clicked));

      btn.appendChild(
        TemporizadorFactura2(() => setFactura2Terminada(true))
      );

      box.appendChild(btn);
    }

    header.appendChild(box);
    fragment.appendChild(header);
  }

  // ✅ Factura 3
  if (clickCount >= 3) {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.transform = "translateY(-190px)";
    header.style.marginLeft = "170px";

    const box = document.createElement("div");
    box.style.backgroundColor = "rgba(0,0,0,0.2)";
    box.style.width = "200px";
    box.style.height = "120px";
    box.style.borderRadius = "12px";
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.alignItems = "center";

    if (factura3Terminada) {
      const div = document.createElement("div");
      div.style.textAlign = "center";

      const text = document.createElement("div");
      text.style.fontSize = "0.9rem";
      text.style.marginBottom = "8px";
      text.style.fontWeight = "bold";
      text.textContent = "lista tu factura 3 valor;";

      const btn = document.createElement("button");
      btn.textContent = "pagar";
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "10px";
      btn.style.padding = "10px 16px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "1.3rem";

      div.appendChild(text);
      div.appendChild(btn);
      box.appendChild(div);
    } else {
      const btn = document.createElement("button");
      btn.style.width = "70px";
      btn.style.height = "70px";
      btn.style.borderRadius = "50%";
      btn.style.fontSize = "0.6rem";
      btn.style.backgroundColor = "#ff0";
      btn.style.color = "#000";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.justifyContent = "center";
      btn.style.alignItems = "center";
      btn.style.textAlign = "center";

      btn.addEventListener("click", () => setClicked(!clicked));

      btn.appendChild(
        TemporizadorFactura3(() => setFactura3Terminada(true))
      );

      box.appendChild(btn);
    }

    header.appendChild(box);
    fragment.appendChild(header);
  }

  return fragment;
}
