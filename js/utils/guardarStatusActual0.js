// ✅ js/utils/guardarStatusActual0.js analiza  el codigo de produccion pero no modifiques nada

export const guardarStatusActual0 = async (aptoParam) => {
  try {
    // 🩵 Determinar el número de apartamento
    let apartmentNumber = aptoParam;

    if (typeof aptoParam === "object" && aptoParam !== null) {
      apartmentNumber = aptoParam.apartmentNumber || aptoParam.userId;
    }

    if (!apartmentNumber) {
      apartmentNumber = localStorage.getItem("apartmentNumber");
    }

    if (!apartmentNumber) {
      console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual = 0");
      return;
    }

    console.log("📤 Enviando a guardar_statusActual (forzado a 0):", {
      userId: apartmentNumber,
      statusActual: 0,
    });

    const res = await fetch("https://backend-1uwd.onrender.com/api/realTime/statusActual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: apartmentNumber,
        statusActual: 0,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al guardar statusActual = 0");
    }

    console.log("✅ StatusActual guardado correctamente con valor 0");
  } catch (error) {
    console.error("❌ Error al guardar statusActual = 0:", error);
  }
};
