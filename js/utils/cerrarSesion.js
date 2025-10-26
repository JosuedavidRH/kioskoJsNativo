// js/utils/cerrarSesion.js



export function cerrarSesionGlobal({
  auto = false,
  temporizadorPrincipal,
  statusActual,
  userId: userIdParam,
  temporizadorFactura1,
  temporizadorFactura2,
  temporizadorFactura3,
} = {}) {
  const userId = userIdParam || localStorage.getItem("apartmentNumber");
  if (!userId) {
    console.warn("⚠️ cerrarSesionGlobal: No se encontró userId");
    return;
  }

  const temp =
    temporizadorPrincipal !== undefined
      ? temporizadorPrincipal
      : Number.parseInt(localStorage.getItem("timeLeftPrincipal"), 10) || 0;

  const tempFactura1 =
    temporizadorFactura1 !== undefined
      ? temporizadorFactura1
      : Number(localStorage.getItem("timeLeft1")) || 0;

  const tempFactura2 =
    temporizadorFactura2 !== undefined
      ? temporizadorFactura2
      : Number(localStorage.getItem("timeLeft2")) || 0;

  const tempFactura3 =
    temporizadorFactura3 !== undefined
      ? temporizadorFactura3
      : Number(localStorage.getItem("timeLeft3")) || 0;

  const body = JSON.stringify({
    userId,
    temporizadorPrincipal: temp,
    temporizadorFactura1: tempFactura1,
    temporizadorFactura2: tempFactura2,
    temporizadorFactura3: tempFactura3,
  });

  try {
    if (auto && navigator.sendBeacon) {
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/cerrarSesion",
        new Blob([body], { type: "application/json" })
      );

      console.log("📡 Datos enviados con sendBeacon (auto)", {
        temp,
        tempFactura1,
        tempFactura2,
        tempFactura3,
      });

      localStorage.clear();
      console.log("🧹 LocalStorage limpiado INMEDIATO (auto)");
      return;
    }

    fetch("https://backend-1uwd.onrender.com/api/realTime/cerrarSesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });

    console.log("📡 Datos enviados con fetch (manual)", {
      temp,
      tempFactura1,
      tempFactura2,
      tempFactura3,
    });
  } catch (e) {
    console.error("❌ Error cerrando sesión:", e);
  } finally {
    if (!auto) {
      localStorage.clear();
      console.log("🧹 LocalStorage limpiado (manual)");
    }
  }
}
