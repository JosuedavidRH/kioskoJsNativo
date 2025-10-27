// 📁 js/components/BotonPrincipal.js analiza  el codigo de produccion pero no modifiques nada

import { guardarStatusActual } from "../utils/guardarStatusActual.js";
import { temporizador } from "../temporizador.js";
import { navigate } from "../app.js";

export function BotonPrincipal({
  clickCount: initialClickCount = 0,
  setClickCount = () => {},
  isProcessing = false,
  setIsProcessing = () => {},
  apartmentNumber,
  startCountdown = () => {},
  initialTime = 43200
}) {
  let clickCount = Number(localStorage.getItem("clickCount") || initialClickCount);
  let processing = isProcessing;

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

  const updateButtonState = () => {
    button.disabled = clickCount === 3 || processing;
    button.style.opacity = button.disabled ? 0.6 : 1;

    if (clickCount === 0) {
      button.textContent = "generar QR";
      button.style.backgroundColor = "#ff0";
    } else if (clickCount === 1) {
      button.textContent = "TIENES 2 COMPRAS MAS";
      button.style.backgroundColor = "#59ff33";
    } else if (clickCount === 2) {
      button.textContent = "TIENES 1 COMPRA MAS";
      button.style.backgroundColor = "#eea82b";
    } else if (clickCount === 3) {
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
        const resp = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`);
        const data = await resp.json();
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
          const nuevosCodigos = Array.from({ length: 3 }, () =>
            Math.floor(100000 + Math.random() * 900000).toString()
          );

          localStorage.setItem("codigos", JSON.stringify(nuevosCodigos));
          localStorage.setItem("indexActual", String(indexToShow));

          for (const codigo of nuevosCodigos) {
            const payload = { numero_apto: String(apartmentNumber), codigo_generado: codigo };
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
