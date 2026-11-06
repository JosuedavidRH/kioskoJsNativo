// js/utils/iniciarCompra.js  en produccion

import { guardarStatusActual } from "./guardarStatusActual.js";

const API = "https://backend-1uwd.onrender.com/api/guardar";

export async function iniciarCompra({ apartmentNumber, clickCount, navigate, destino }) {
  const apto = encodeURIComponent(apartmentNumber);

  // 1) ¿Ya hay un código activo?
  const resp = await fetch(`${API}/recuperar/${apto}`);
  if (!resp.ok) throw new Error(`recuperar respondió ${resp.status}`);
  const data = await resp.json();

  let codigos;
  if (data.success && Array.isArray(data.data) && data.data.length > 0) {
    codigos = data.data.map((item) => item.codigo_qr);
  } else {
    // 2) Si no hay, crear uno y confirmar que el backend lo guardó
    const nuevo = String(Math.floor(100000 + Math.random() * 900000));
    const post = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero_apto: String(apartmentNumber), codigo_generado: nuevo }),
    });
    if (!post.ok) throw new Error(`guardar respondió ${post.status}`);
    codigos = [nuevo];
  }

  // 3) Avance optimista (igual que BotonPrincipal)
  const indexToShow = clickCount;          // compra previa: 1 o 2
  const nuevoCount = clickCount + 1;       // 2 o 3

  localStorage.setItem("codigos", JSON.stringify(codigos));
  localStorage.setItem("indexActual", String(indexToShow));
  localStorage.setItem("clickCount", String(nuevoCount));

  try {
    await guardarStatusActual(nuevoCount, apartmentNumber);
  } catch (e) {
    console.warn("No se pudo guardar statusActual, se continúa:", e);
  }

  // 4) Misma forma de datos que usa BotonPrincipal → segunda
  navigate(destino, { user: apartmentNumber, codigos, indexActual: indexToShow });
}