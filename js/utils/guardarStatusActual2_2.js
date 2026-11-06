// ✅ js/utils/guardarStatusActual2_2.js  en produccion 

export const guardarStatusActual2_2 = async (aptoParam) => {
  try {
    // 🩵 Leer clickCount desde localStorage
    const clickCount = Number(localStorage.getItem("clickCount"));

    // Solo se guarda cuando clickCount es 2 o -2 (siempre como 2)
    if (Math.abs(clickCount) !== 2) return;

    // 🩵 Determinar el número de apartamento
    let apartmentNumber = aptoParam;

    if (typeof aptoParam === "object" && aptoParam !== null) {
      apartmentNumber = aptoParam.apartmentNumber || aptoParam.userId;
    }

    if (!apartmentNumber) {
      apartmentNumber = localStorage.getItem("apartmentNumber");
    }

    if (!apartmentNumber) {
      console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual = 2");
      return;
    }

    console.log("📤 Enviando a guardar_statusActual2_2 (forzado a 2):", {
      userId: apartmentNumber,
      statusActual: 2,
    });

    const res = await fetch("https://backend-1uwd.onrender.com/api/realTime/statusActual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: apartmentNumber,
        statusActual: 2,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al guardar statusActual = 2");
    }

    console.log("✅ StatusActual2_2 guardado correctamente con valor 2");
  } catch (error) {
    console.error("❌ Error al guardar statusActual = 2:", error);
  }
};