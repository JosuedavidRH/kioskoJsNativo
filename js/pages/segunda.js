// js/pages/segunda.js

// import { restaurarDatos2 } from "../utils/restaurarDatos2.js";

// ✅ Generar 3 códigos aleatorios de 6 dígitos
function generarTresCodigos() {
  return Array.from({ length: 3 }, () =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
}

export function SegundaPage({ user, navigate }) {
  const wrapper = document.createElement("div");
  wrapper.style.backgroundColor = "white";
  wrapper.style.color = "black";
  wrapper.style.textAlign = "center";
  wrapper.style.paddingTop = "50px";
  wrapper.style.minHeight = "100vh";

  // --- Título
  const title = document.createElement("h2");
  
  title.textContent = `Bienvenido apartamento ${user?.apartmentNumber || user} a la segunda página`;

  title.style.marginBottom = "30px";
  wrapper.appendChild(title);

  // --- Contenedor de códigos
  const codigosContainer = document.createElement("div");
  codigosContainer.style.display = "flex";
  codigosContainer.style.justifyContent = "center";
  codigosContainer.style.gap = "30px";
  codigosContainer.style.marginBottom = "40px";
  wrapper.appendChild(codigosContainer);

  // --- Contenedor para el QR
  const qrContainer = document.createElement("div");
  qrContainer.style.display = "flex";
  qrContainer.style.justifyContent = "center";
  qrContainer.style.marginBottom = "20px";
  wrapper.appendChild(qrContainer);

  // --- Botón volver
  const btnVolver = document.createElement("button");
  btnVolver.textContent = "Volver a la página principal";
  btnVolver.style.marginTop = "60px";
  btnVolver.style.backgroundColor = "#4CAF50";
  btnVolver.style.color = "white";
  btnVolver.style.border = "none";
  btnVolver.style.borderRadius = "90px";
  btnVolver.style.width = "160px";
  btnVolver.style.height = "160px";
  btnVolver.style.padding = "40px";
  btnVolver.style.cursor = "pointer";
  btnVolver.style.fontSize = "0.9rem";
  btnVolver.style.fontWeight = "bold";
  wrapper.appendChild(btnVolver);

  // --- Variables locales
  let codigos = [];
  let indexActual = 0;

  // --- Cargar script QRCode si no está presente
  async function ensureQRCodeLoaded() {
    if (window.QRCode) return true;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js";
      script.async = true;

      script.onload = () => {
        console.log("✅ QRCode library loaded correctamente");
        resolve(true);
      };

      script.onerror = () => {
        console.error("❌ Error al cargar la librería QRCode");
        reject(new Error("QR library load failed"));
      };

      document.head.appendChild(script);
    });
  }

  // --- Cargar y restaurar datos (imitando useEffect)
  async function cargarDatos() {
    try {
      const localUser = user?.username || user;
      if (!localUser) {
        navigate("home");
        return;
      }

      await ensureQRCodeLoaded(); // 🔹 Garantizar que QRCode esté disponible antes de renderizar

      const codigosGuardados = JSON.parse(localStorage.getItem("codigos"));
      const indexGuardado = parseInt(localStorage.getItem("indexActual"), 10);

      if (
        codigosGuardados &&
        Array.isArray(codigosGuardados) &&
        !isNaN(indexGuardado) &&
        indexGuardado < 3
      ) {
        codigos = codigosGuardados;
        indexActual = indexGuardado;
        render();
        return;
      }

      // Si no hay datos locales, generamos nuevos
      codigos = generarTresCodigos();
      indexActual = 0;
      localStorage.setItem("codigos", JSON.stringify(codigos));
      localStorage.setItem("indexActual", "0");
      render();
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  }

  // --- Renderizar la vista
  function render() {
    codigosContainer.innerHTML = "";
    qrContainer.innerHTML = "";

    codigos.forEach((code, i) => {
      const box = document.createElement("div");
      box.textContent = code;
      box.style.padding = "10px 20px";
      box.style.borderRadius = "10px";
      box.style.fontWeight = "bold";
      box.style.fontSize = "1.3rem";
      box.style.backgroundColor = i === indexActual ? "#00c0ff" : "#f0f0f0";
      codigosContainer.appendChild(box);
    });

    // --- Generar QR siempre del primer código
    const qrActual = codigos[0]; // ✅ fijado al primer código
    if (qrActual && window.QRCode) {
      const canvas = document.createElement("canvas");
      qrContainer.appendChild(canvas);

      window.QRCode.toCanvas(
        canvas,
        `${user?.apartmentNumber || user}|${qrActual}`, // ✅ formato: "2247|548921"
        { width: 200 },
        (err) => {
          if (err) console.error(err);
        }
      );
    } else {
      const p = document.createElement("p");
      p.textContent = "No hay más QR para mostrar.";
      qrContainer.appendChild(p);
    }
  } // ← 💥 ESTA LLAVE FALTABA

  // --- Evento del botón volver
  btnVolver.addEventListener("click", () => {
    const nuevoIndex = indexActual + 1;

    if (nuevoIndex < 3) {
      localStorage.setItem("indexActual", nuevoIndex.toString());
    } else {
      const nuevosCodigos = generarTresCodigos();
      localStorage.setItem("codigos", JSON.stringify(nuevosCodigos));
      localStorage.setItem("indexActual", "0");
    }

    navigate("home");
  });

  // --- Cargar datos al inicio
  cargarDatos();

  return wrapper;
}
