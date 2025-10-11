
//guardarStatusActual.js


export const guardarStatusActual = async (nuevoEstado, aptoParam) => {
  try {
    // 🩵 Garantizamos que apartmentNumber sea un valor plano (string o número)
    let apartmentNumber = aptoParam;

    if (typeof aptoParam === "object" && aptoParam !== null) {
      apartmentNumber = aptoParam.apartmentNumber || aptoParam.userId;
    }

    // Si no vino del parámetro, lo buscamos en localStorage
    if (!apartmentNumber) {
      apartmentNumber = localStorage.getItem("apartmentNumber");
    }

    if (!apartmentNumber) {
      console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual");
      return;
    }

    console.log("📤 Enviando a guardar_statusActual:", {
      userId: apartmentNumber,
      statusActual: nuevoEstado,
    });

    const res = await fetch("https://backend-1uwd.onrender.com/api/realTime/statusActual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: apartmentNumber,
        statusActual: nuevoEstado,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al guardar statusActual");

    console.log("✅ StatusActual guardado correctamente");
  } catch (error) {
    console.error("❌ Error al guardar statusActual:", error);
  }
};
