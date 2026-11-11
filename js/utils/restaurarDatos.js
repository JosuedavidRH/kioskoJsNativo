//  utils/restaurarDatos.js analiza  el codigo de produccion pero no modifiques nada


export const restaurarDatos = async ({
  apartmentNumber,
  onTimeLeftChange,
  onFondoRojoChange,
  onClickCountChange,
  restart,
  startCountdown, // opcional

  onTimeLeftFactura1Change,
  onTimeLeftFactura2Change,
  onTimeLeftFactura3Change,

  startFactura1,
  startFactura2,
  startFactura3,

  onRestauracionCompleta, // 🔹 NUEVO callback
}) => {
  try {


   // ============================================================
    // 🛑 OMITIR RESTAURACIÓN SI SE DETECTÓ UN CÓDIGO QR VÁLIDO
    // ============================================================

    if (localStorage.getItem("omitirRestauracionUnaVez") === "1") {

      localStorage.removeItem("omitirRestauracionUnaVez");

      console.log("🛑 Restauración omitida: código QR válido detectado");

      if (onRestauracionCompleta) onRestauracionCompleta();

      return;
    }


 // ============================================================
    // -------- CONSULTAR BACKEND --------
    // ============================================================

    const res = await fetch(`https://backend-1uwd.onrender.com/api/realTime/${apartmentNumber}`);
    const data = await res.json();

    console.log("🔍 Datos recibidos del backend:", data);

    if (!data.success || !data.data) {

      
     console.log("🟢 Usuario nuevo detectado, bloqueando factura1Terminada...");

   // 🛑 Marcar usuario nuevo
    window.usuarioNuevo = true;
 
   // 🛑 Bloquear factura1Terminada desde el inicio
    localStorage.removeItem("factura1Terminada");



      const keysToRemove = [
        "clicked",
        "codigos",
        "factura1Terminada",
        "factura2Terminada",
        "factura3Terminada",
        "indexActual",
        "timeLeftFactura1",
        "timeLeftFactura2",
        "timeLeftFactura3",
        "timerStarted",
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      onTimeLeftChange?.(120);
      onFondoRojoChange?.(false);
      onClickCountChange?.(0);
      localStorage.setItem("clickCount", 0);

      onTimeLeftFactura1Change?.(0);
      onTimeLeftFactura2Change?.(0);
      onTimeLeftFactura3Change?.(0);

      if (restart) {
        const exp = new Date();
        exp.setSeconds(exp.getSeconds() + 120);
        restart(exp, false);
      }

      if (onRestauracionCompleta) onRestauracionCompleta(); // 🔹 Ejecutar callback
      return;
    }

    const {
      temporizadorPrincipal,
      temporizadorFactura1,
      temporizadorFactura2,
      temporizadorFactura3,
      updated_at,
      statusActual,
    } = data.data;

// ---------------------------------------------------------------------
    // --------Condiciones para restaurar datos   ---------------------
    // ---------------------------------------------------------------------
    

    
// Valor lógico para controlar temporizadores y facturas
const statusNum = statusActual != null
  ? Math.abs(Number(statusActual))
  : 0;



 // Convertir exclusivamente cuando el backend envíe 1
if (Number(statusActual) === 1) {

    const clickCountUI = 1;

    onClickCountChange?.(clickCountUI);
    localStorage.setItem("clickCount", clickCountUI);

}


// Convertir exclusivamente cuando el backend envíe 2
if (Number(statusActual) === 2) {

    const clickCountUI = -2;

    onClickCountChange?.(clickCountUI);
    localStorage.setItem("clickCount", clickCountUI);

}

// Cuando el backend envíe -2, clickCount será 2
if (Number(statusActual) === -2) {

    const clickCountUI = 2;

    onClickCountChange?.(clickCountUI);
    localStorage.setItem("clickCount", clickCountUI);

}




    // ---------- 🕒 PRINCIPAL ----------
    if ((statusNum >= 0  || temporizadorPrincipal == null) {
  const timeLeft = 180;

  // 🔹 Actualizar UI
  onTimeLeftChange?.(timeLeft);
  onFondoRojoChange?.(false);

  // 🔹 Enviar valor al backend
  try {
    await fetch("https://backend-1uwd.onrender.com/api/realTime/temporizador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: apartmentNumber,           // asegúrate de que tengas apartmentNumber definido
        temporizadorPrincipal: timeLeft,
      }),
    });
    console.log("✅ timeLeftPrincipal enviado al backend:", timeLeft);
  } catch (error) {
    console.error("❌ Error enviando timeLeftPrincipal al backend:", error);
  }

  // 🔹 Reiniciar temporizador local
  if (restart) {
    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + timeLeft);
    restart(exp, true);
  }


    } else {
      const tiempoGuardado = parseInt(temporizadorPrincipal, 10);
      const horaCierre = new Date(updated_at).getTime();
      const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
      const tiempoRestante = tiempoGuardado - tiempoTranscurrido;

      console.log("⏱ temporizadorPrincipal:", temporizadorPrincipal);
      console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
      console.log("⏰ tiempoRestante:", tiempoRestante);

      if (!isNaN(tiempoRestante) && tiempoRestante > 0) {
        onTimeLeftChange?.(tiempoRestante);
        onFondoRojoChange?.(false);

        if (restart) {
          const exp = new Date();
          exp.setSeconds(exp.getSeconds() + tiempoRestante);
          restart(exp, true);
        }
      } else {
        onTimeLeftChange?.(0);
        onFondoRojoChange?.(statusNum > 0);

        if (restart) {
          const exp = new Date();
          exp.setSeconds(exp.getSeconds() + 0);
          restart(exp, false);
        }
      }
    }

    // ---------- 🧾 FACTURA 1 ----------
    if (onTimeLeftFactura1Change && Number(statusActual) !== -2) {
  if (statusNum === 0 || temporizadorFactura1 == null) {
    // 🔹 Inicializar factura 1
    const initialTime = 10800;
    onTimeLeftFactura1Change(initialTime);
    localStorage.setItem("timeLeft1", String(initialTime));

    // 🔹 Enviar al backend (opcional)
    try {
      await fetch("https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: apartmentNumber,
          temporizadorFactura1: initialTime,
        }),
      });
      console.log("✅ timeLeftFactura1 enviado al backend:", initialTime);
    } catch (error) {
      console.error("❌ Error enviando timeLeftFactura1 al backend:", error);
    }

        if (typeof startFactura1 === "function") startFactura1(0);
      } else {
        const tiempo1 = parseInt(temporizadorFactura1, 10);
        if (!isNaN(tiempo1)) {
          const horaCierre = new Date(updated_at).getTime();
          const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
          const tiempoRestante = tiempo1 - tiempoTranscurrido;

          console.log("⏱ temporizadorFactura1:", temporizadorFactura1);
          console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
          console.log("⏰ tiempoRestante (Factura 1):", tiempoRestante);

          if (tiempoRestante > 0) {
            onTimeLeftFactura1Change(tiempoRestante);
            localStorage.setItem("timeLeftFactura1", String(tiempoRestante));
            if (typeof startFactura1 === "function") startFactura1(tiempoRestante);
          } else {
            onTimeLeftFactura1Change(0);
            localStorage.setItem("timeLeftFactura1", "0");
          }
        }
      }
    }

    // ---------- 🧾 FACTURA 2 ----------

    if (onTimeLeftFactura2Change) {
      if (statusNum < 2 || temporizadorFactura2 == null) {
        // 🔹 Inicializar factura 2
        const initialTime = 10800;
        onTimeLeftFactura2Change(initialTime);
        localStorage.setItem("timeLeft2", String(initialTime));

        // 🔹 Enviar al backend (opcional)
        try {
          await fetch("https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: apartmentNumber,
              temporizadorFactura2: initialTime,
            }),
          });
          console.log("✅ timeLeftFactura2 enviado al backend:", initialTime);
        } catch (error) {
          console.error("❌ Error enviando timeLeftFactura2 al backend:", error);
        }

        if (typeof startFactura2 === "function") startFactura2(0);
      } else {
        const tiempo2 = parseInt(temporizadorFactura2, 10);
        if (!isNaN(tiempo2)) {
          const horaCierre = new Date(updated_at).getTime();
          const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
          const tiempoRestante = tiempo2 - tiempoTranscurrido;

          console.log("⏱ temporizadorFactura2:", temporizadorFactura2);
          console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
          console.log("⏰ tiempoRestante (Factura 2):", tiempoRestante);

          if (tiempoRestante > 0) {
            onTimeLeftFactura2Change(tiempoRestante);
            localStorage.setItem("timeLeftFactura2", String(tiempoRestante));
            if (typeof startFactura2 === "function") startFactura2(tiempoRestante);
          } else {
            onTimeLeftFactura2Change(0);
            localStorage.setItem("timeLeftFactura2", "0");
          }
        }
      }
    }
    
    // 🔹 Ejecutar callback al final de restauración
    if (onRestauracionCompleta) onRestauracionCompleta();

  } catch (error) {
    console.error("❌ Error al obtener datos iniciales:", error);
    onTimeLeftChange?.(120);
    onFondoRojoChange?.(false);

    onTimeLeftFactura1Change?.(0);
    onTimeLeftFactura2Change?.(0);
    onTimeLeftFactura3Change?.(0);

    if (restart) {
      const exp = new Date();
      exp.setSeconds(exp.getSeconds() + 120);
      restart(exp, false);
    }

    // 🔹 Ejecutar callback incluso en error
    if (onRestauracionCompleta) onRestauracionCompleta();
  }
};
