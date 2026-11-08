// 📁 js/components/BotonPrincipal.js analiza  el codigo de produccion pero no modifiques nada

import { guardarStatusActual } from "../utils/guardarStatusActual.js";
import { temporizador } from "../temporizador.js";
import { navigate } from "../app.js";


export function BotonPrincipal({
  clickCount: initialClickCount = 0,
  username,
  setClickCount = () => {},
  isProcessing = false,
  setIsProcessing = () => {},
  apartmentNumber,
  startCountdown = () => {},
  initialTime = 43200,
   onLogout = () => {}          // 👈 nueva
}) {
  let clickCount = Number(localStorage.getItem("clickCount") || initialClickCount);
  let processing = isProcessing;

  console.log("📱 username recibido:", username);


  // 🔹 Guardar username (numero de whatsApp )en localStorage
  if (username) {
  localStorage.setItem("user", username);
 }

  const button = document.createElement("button");
  button.style.width = "140px";
  button.style.height = "140px";
  button.style.borderRadius = "50%";
  button.style.fontSize = "0.8rem";
  button.style.color = "#000";
  button.style.border = "none";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.cursor = "pointer";
  button.style.position = "relative";
  button.style.top = "-65px";

  // ✨ Interactividad del botón amarillo (solo cuando clickCount === 0)
  button.style.transition = "all 0.2s ease";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 5px 12px rgba(0,0,0,0.35)";
  button.style.transform = "scale(1)";

  const esInteractivo = () => clickCount === 0 && !button.disabled;

  button.addEventListener("mouseenter", () => {
    if (!esInteractivo()) return;
    button.style.transform = "scale(1.08) translateY(-3px)";
    button.style.boxShadow = "0 8px 18px rgba(0,0,0,0.4)";
    button.style.filter = "brightness(1.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0 5px 12px rgba(0,0,0,0.35)";
    button.style.filter = "none";
  });

  button.addEventListener("mousedown", () => {
    if (!esInteractivo()) return;
    button.style.transform = "scale(0.94)";
  });

  button.addEventListener("mouseup", () => {
    if (!esInteractivo()) return;
    button.style.transform = "scale(1.08) translateY(-3px)";
  });


  const updateButtonState = () => {
    button.disabled = clickCount === 3 || processing;
    button.style.opacity = button.disabled ? 0.6 : 1;

    if (clickCount === 0) {
      button.textContent = "COMPRAR";
      button.style.backgroundColor = "#ff0";
    } else if (clickCount === 1) {
      button.textContent = "TIENES 2 COMPRAS MAS";
      button.style.backgroundColor = "#59ff33";
    } else if (clickCount === 2) {
  button.textContent = "";
  button.style.backgroundColor = "transparent";
  button.style.color = "transparent";
  }else if (clickCount === 3) {
      button.textContent = "YA NO TIENES MAS COMPRAS";
      button.style.backgroundColor = "#fd531e";
    }
  };

  const handleClick = async () => {
    if (processing || clickCount === 3) return;
    processing = true;
    setIsProcessing(true);
    updateButtonState();

    const indexToShow = clickCount;

    try {
      if (clickCount === 0) {

        // 🔎 Consultar statusActual (misma lógica y mismo backend que restaurarDatos)
let bloquear = false;
try {
  const resStatus = await fetch(`http://localhost:4000/api/realtime/${apartmentNumber}`);

  if (!resStatus.ok) {
    throw new Error(`HTTP ${resStatus.status}`);
  }

  const dataStatus = await resStatus.json();
  console.log("🔍 Datos recibidos del backend (status):", dataStatus);

  if (dataStatus.success && dataStatus.data) {
    const { statusActual } = dataStatus.data;
    console.log("🔎 statusActual consultado:", statusActual);

    if (Number(statusActual) === 1) {
      bloquear = true;
    }
  }
  // success false o data null → usuario nuevo → se permite comprar
} catch (e) {
  console.warn("⚠️ No se pudo verificar statusActual → se bloquea por seguridad:", e);
  bloquear = true;
}

// 🚫 Si el backend devuelve 1 (o no se pudo verificar), NO navegar a segunda y cerrar sesión
if (bloquear) {
  console.warn("⛔ COMPRAR bloqueado, no se navega a segunda → cerrando sesión");
  processing = false;
  setIsProcessing(false);
  updateButtonState();
  onLogout();                  // 👈 activa el cierre de sesión
  return;
}

        console.log("📦 apartmentNumber:", apartmentNumber);

        const resp = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`);
        const data = await resp.json();


        // 🔍 Logs de depuración
console.log("📦 Respuesta completa:", data);
console.log("📦 data.data:", data.data);



        const hayCodigos = data.success && data.data && data.data.length > 0;

        if (hayCodigos) {
          const codigosBD = data.data.map(item => item.codigo_qr);
          localStorage.setItem("codigos", JSON.stringify(codigosBD));
          localStorage.setItem("indexActual", String(indexToShow));

          clickCount = (clickCount + 1) % 4;
          setClickCount(clickCount);
          guardarStatusActual(clickCount, apartmentNumber);

          navigate("segunda", { user: apartmentNumber, codigos: codigosBD, indexActual: indexToShow });
        } else {

          // 🔹 Generar nuevos códigos
const nuevosCodigos = Array.from({ length: 1 }, () =>
  Math.floor(100000 + Math.random() * 900000).toString()
);

// 🔹 Guardar en localStorage antes de navegar
localStorage.setItem("codigosss", JSON.stringify(nuevosCodigos));// codigos  se modifico a codigosss  con esto se resolvio el conflicto en localstorage


localStorage.setItem("indexActualss", "0"); // indexActual  se modifico en indexActualss con esto se resolvio el conflicto en localstorage


console.log("✅ LocalStorage actualizado con nuevos códigos:", nuevosCodigos);

// 🔹 Enviar cada código al backend
for (const codigo of nuevosCodigos) {
  const payload = { numero_apto: String(apartmentNumber), codigo_generado: codigo };
  console.log("📤 Enviando código al backend:", payload);

  await fetch("https://backend-1uwd.onrender.com/api/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}


          // 🔹 Actualizar estado y navegar
          clickCount = (clickCount + 1) % 4;
          setClickCount(clickCount);
          guardarStatusActual(clickCount, apartmentNumber);

          navigate("segunda", { user: apartmentNumber, codigos: nuevosCodigos, indexActual: indexToShow });
        }
      } else if (clickCount === 1 || clickCount === 2) {
        const resp = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`);
        const data = await resp.json();

        if (data.success && data.data && data.data.length > 0) {
          const codigosBD = data.data.map(item => item.codigo_qr);
          localStorage.setItem("codigos", JSON.stringify(codigosBD));
          localStorage.setItem("indexActual", String(indexToShow));

          clickCount = (clickCount + 1) % 4;
          setClickCount(clickCount);
          guardarStatusActual(clickCount, apartmentNumber);

          navigate("segunda", { user: apartmentNumber, codigos: codigosBD, indexActual: indexToShow });
        } else {
          const codigosLocal = JSON.parse(localStorage.getItem("codigos") || "[]");
          if (codigosLocal.length > 0) {
            console.warn("⚠️ No hay datos en backend, usando códigos locales.");
            localStorage.setItem("indexActual", String(indexToShow));

            clickCount = (clickCount + 1) % 4;
            setClickCount(clickCount);
            guardarStatusActual(clickCount, apartmentNumber);

            navigate("segunda", { user: apartmentNumber, codigos: codigosLocal, indexActual: indexToShow });
          } else {
            console.warn("⚠️ No se encontraron códigos en backend ni en localStorage.");
          }
        }
      } else {
        clickCount = (clickCount + 1) % 4;
        setClickCount(clickCount);
        guardarStatusActual(clickCount, apartmentNumber);
      }
    } catch (error) {
      console.error("❌ Error general en handleClick:", error);
    }

    processing = false;
    setIsProcessing(false);
    updateButtonState();
  };

  button.addEventListener("click", handleClick);
  updateButtonState();
  return button;
}
