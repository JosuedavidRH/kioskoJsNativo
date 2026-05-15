// js/pages/segunda.js  analiza  el codigo de produccion pero no modifiques nada


import { guardarStatusActual0 } from "../utils/guardarStatusActual0.js";
import { guardarStatusActual } from "../utils/guardarStatusActual.js";
import { enviarWhatsApp } from "../utils/enviarWhatsApp.js";

// ✅ Generar 1 código aleatorio de 6 dígitos
function generarTresCodigos() {
  return Array.from({ length: 1 }, () =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
}

export function SegundaPage({ user, codigos: codigosPasados, indexActual: indexPasado, navigate }) {
  const wrapper = document.createElement("div");
  wrapper.style.backgroundColor = "white";
  wrapper.style.color = "black";
  wrapper.style.textAlign = "center";
  wrapper.style.paddingTop = "50px";
  wrapper.style.minHeight = "100vh";


  // ✅🛑 BORRAR FACTURAS SOLO SI EL USUARIO ES NUEVO
  if (window.usuarioNuevo) {
    console.warn("🛑 Usuario nuevo → limpiando facturas terminadas");
    localStorage.removeItem("factura1Terminada");
    localStorage.removeItem("factura2Terminada");
    localStorage.removeItem("factura3Terminada");
  }

  // --- Título
  const title = document.createElement("h2");
  title.textContent = `Activa tu compra , Acercando este codigo al lector de la tienda`;
  title.style.marginBottom = "20px";
  wrapper.appendChild(title);

  // --- Imagen QR animada
  const qrGif = document.createElement("img");
  qrGif.src = "./public/qr.gif";
  qrGif.alt = "Animación escanear QR";
  qrGif.style.width = "200px";
  qrGif.style.height = "auto";
  qrGif.style.marginBottom = "30px";
  qrGif.style.borderRadius = "10px";
  wrapper.appendChild(qrGif);

  // --- Contenedor para el QR
  const qrContainer = document.createElement("div");
  qrContainer.style.display = "flex";
  qrContainer.style.justifyContent = "center";
  qrContainer.style.marginBottom = "20px";
  wrapper.appendChild(qrContainer);

  // --- ⏱️ Temporizador debajo del botón
  const timerText = document.createElement("p");
  timerText.style.fontSize = "1.5rem";
  timerText.style.marginTop = "20px";
  timerText.style.fontWeight = "bold";
  timerText.style.color = "#333";
  wrapper.appendChild(timerText);

  // --- Variables locales
  let codigos = [];
  let indexActual = 0;
  let intervalo;

  // --- ✅ Función para obtener número de WhatsApp
  function obtenerNumeroUsuario() {
    let numero = localStorage.getItem("user") || user?.username || user;
    if (numero && !numero.startsWith("+")) {
      numero = "+57" + numero;
    }
    return numero;
  }

  // --- Asegurar que QRCode esté cargado
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

  // --- Cargar y restaurar datos
  async function cargarDatos() {
    try {
      const localUser = user?.username || user;
      if (!localUser) {
        navigate("home");
        return;
      }

      await ensureQRCodeLoaded();

      // 1️⃣ Si vienen códigos desde BotonPrincipal
      if (Array.isArray(codigosPasados) && codigosPasados.length > 0) {
        codigos = codigosPasados;
        indexActual = indexPasado || 0;

        localStorage.setItem("codigos", JSON.stringify(codigos));
        localStorage.setItem("indexActual", indexActual.toString());

        console.log("✅ Usando códigos recibidos desde BotonPrincipal:", codigos);
        render();
        iniciarTemporizador(localUser);
        return;
      }

      // 2️⃣ Si hay datos guardados en localStorage
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
        console.log("✅ Restaurando códigos desde localStorage:", codigos);
        render();
        iniciarTemporizador(localUser);
        return;
      }

      // 3️⃣ Si no hay códigos, generar nuevos
      codigos = generarTresCodigos();
      indexActual = 0;
      localStorage.setItem("codigos", JSON.stringify(codigos));
      localStorage.setItem("indexActual", "0");
      console.warn("⚠️ No se encontraron códigos, se generaron nuevos:", codigos);
      render();
      iniciarTemporizador(localUser);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  }

  // --- Renderizar QR
  function render() {
    qrContainer.innerHTML = "";

    const qrActual = codigos[0];
    if (qrActual && window.QRCode) {
      const canvas = document.createElement("canvas");
      qrContainer.appendChild(canvas);

      window.QRCode.toCanvas(
        canvas,
        `${user?.apartmentNumber || user}|${qrActual}`,
        { width: 300 },
        (err) => {
          if (err) console.error(err);
        }
      );
    } else {
      const p = document.createElement("p");
      p.textContent = "No hay más QR para mostrar.";
      qrContainer.appendChild(p);
    }
  }

  // --- ⏱️ Temporizador con verificación de backend
  function iniciarTemporizador(apartmentNumber) {
    let tiempoRestante = 45;
    timerText.textContent = `ESTE CÓDIGO VENCE EN ${tiempoRestante} segundos`;

    intervalo = setInterval(async () => {
      tiempoRestante--;
      timerText.textContent = `ESTE CÓDIGO VENCE EN ${tiempoRestante} segundos`;

      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        window.onbeforeunload = null;

        try {
          console.log("⏱️ Verificando backend antes de regresar a home...");
          const resp = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`);
          const data = await resp.json();

          // 🔸 Caso 1: sin códigos → HOME clickCount = 1
          if (!data.success || !data.data || data.data.length === 0) {
            console.log("⚪ No hay códigos activos → HOME clickCount = 1");
            localStorage.setItem("clickCount", "1");

            try {
              let apartmentNumberFinal =
                (typeof user === "object" && user?.apartmentNumber) ||
                localStorage.getItem("apartmentNumber") ||
                user;

              if (apartmentNumberFinal) {
                console.log("📤 enviando guardarStatusActual(1) con apartmentNumber:", apartmentNumberFinal);
                await guardarStatusActual(1, apartmentNumberFinal);

                // 🚀 SOLO AQUÍ se envía el WhatsApp usando número dinámico
                const numeroDestino = obtenerNumeroUsuario();
                console.log("📱 Enviando WhatsApp a:", numeroDestino);
                await enviarWhatsApp(numeroDestino);
              } else {
                console.warn("⚠️ No se encontró apartmentNumber al guardar statusActual=1");
              }
            } catch (err) {
              console.error("❌ Error al ejecutar guardarStatusActual(1):", err);
            }

            navigate("home");
            return;
          }

          // 🔸 Caso 2: hay código válido de 6 dígitos → HOME clickCount = 0
          const codigo = data.data[0]?.codigo_qr;
          if (codigo && /^\d{6}$/.test(codigo)) {
            console.log("🟢 Código válido detectado:", codigo, "→ HOME clickCount = 0");
            localStorage.setItem("clickCount", "0");
            console.log("🟡 Llamando guardarStatusActual0...");
            await guardarStatusActual0(apartmentNumber);
          }

          navigate("home");
        } catch (error) {
          console.error("❌ Error al verificar el backend:", error);
          navigate("home");
        }
      }
    }, 1000);
  }

  // --- Cargar todo al iniciar
  cargarDatos();

  console.log("👤 user recibido en SegundaPage:", user);

  return wrapper;
}
