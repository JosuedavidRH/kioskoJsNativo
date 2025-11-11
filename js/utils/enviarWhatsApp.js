// 📦 src/utils/enviarWhatsApp.js

/**
 * Envía un mensaje de WhatsApp usando el backend de Twilio.
 * @param {string} numero - Número del destinatario en formato internacional (por ejemplo: +573001234567)
 * @param {string} mensaje - Texto del mensaje a enviar
 * @returns {Promise<object>} - Respuesta del backend
 */
export async function enviarWhatsApp(numero, mensaje) {
  try {
    console.log("📨 Enviando mensaje a backend WhatsApp...", { numero, mensaje });

    const response = await fetch("https://backend-1uwd.onrender.com/api/enviar-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: numero, mensaje }),
    });

    if (!response.ok) {
      console.error("⚠️ Error HTTP al enviar WhatsApp:", response.status, response.statusText);
      return { success: false, error: "HTTP error" };
    }

    const data = await response.json();

    if (data.success) {
      console.log("✅ Mensaje de WhatsApp enviado correctamente.");
    } else {
      console.warn("⚠️ El backend no confirmó éxito:", data);
    }

    return data;
  } catch (err) {
    console.error("❌ Error al enviar WhatsApp:", err);
    return { success: false, error: err.message };
  }
}
