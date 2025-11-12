// js/pages/register.js   analiza  el codigo de produccion pero no modifiques nada

export function RegisterPage(goToLogin, onRegister) {
  const wrapper = document.createElement("div");
  wrapper.className = "register-background";

  const container = document.createElement("div");
  container.className = "register-container";
  wrapper.appendChild(container);

  const title = document.createElement("h2");
  title.className = "register-title";
  title.textContent = "Registrarse";
  container.appendChild(title);

  const form = document.createElement("form");
  form.className = "register-form";

  // --- Apartamento ---
  const inputApartment = document.createElement("input");
  inputApartment.type = "text";
  inputApartment.placeholder = "Número de apartamento";

  // --- Contraseña ---
  const passContainer = document.createElement("div");
  passContainer.style.position = "relative";
  passContainer.style.width = "100%";

  const inputPass = document.createElement("input");
  inputPass.type = "password";
  inputPass.placeholder = "Contraseña";
  inputPass.style.paddingRight = "35px";

  const toggleIcon = document.createElement("span");
  toggleIcon.textContent = "👁️";
  toggleIcon.style.position = "absolute";
  toggleIcon.style.right = "10px";
  toggleIcon.style.top = "50%";
  toggleIcon.style.transform = "translateY(-50%)";
  toggleIcon.style.cursor = "pointer";
  toggleIcon.style.userSelect = "none";
  toggleIcon.addEventListener("click", () => {
    inputPass.type = inputPass.type === "password" ? "text" : "password";
    toggleIcon.textContent = inputPass.type === "password" ? "👁️" : "🙈";
  });

  passContainer.appendChild(inputPass);
  passContainer.appendChild(toggleIcon);

  // --- Repite contraseña ---
  const passRepeatContainer = document.createElement("div");
  passRepeatContainer.style.position = "relative";
  passRepeatContainer.style.width = "100%";

  const inputPassRepeat = document.createElement("input");
  inputPassRepeat.type = "password";
  inputPassRepeat.placeholder = "Repite tu contraseña";
  inputPassRepeat.style.paddingRight = "35px";

  const toggleIconRepeat = document.createElement("span");
  toggleIconRepeat.textContent = "👁️";
  toggleIconRepeat.style.position = "absolute";
  toggleIconRepeat.style.right = "10px";
  toggleIconRepeat.style.top = "50%";
  toggleIconRepeat.style.transform = "translateY(-50%)";
  toggleIconRepeat.style.cursor = "pointer";
  toggleIconRepeat.style.userSelect = "none";
  toggleIconRepeat.addEventListener("click", () => {
    inputPassRepeat.type =
      inputPassRepeat.type === "password" ? "text" : "password";
    toggleIconRepeat.textContent =
      inputPassRepeat.type === "password" ? "👁️" : "🙈";
  });

  passRepeatContainer.appendChild(inputPassRepeat);
  passRepeatContainer.appendChild(toggleIconRepeat);

  // --- WhatsApp ---
  const inputUser = document.createElement("input");
  inputUser.type = "number";
  inputUser.placeholder = "Tu WhatsApp";

  // --- Botón Registrar ---
  const btnSubmit = document.createElement("button");
  btnSubmit.type = "submit";
  btnSubmit.textContent = "Registrar";

  // --- Cuadro de verificación ---
  const verifyBox = document.createElement("div");
  verifyBox.style.display = "none";
  verifyBox.style.marginTop = "15px";
  verifyBox.style.padding = "15px";
  verifyBox.style.border = "1px solid #ccc";
  verifyBox.style.borderRadius = "8px";
  verifyBox.style.background = "#f9f9f9";

  const verifyText = document.createElement("p");
  verifyText.textContent = "Introduce el código de verificación enviado a tu WhatsApp:";
  verifyText.style.marginBottom = "10px";

  const inputCode = document.createElement("input");
  inputCode.type = "text";
  inputCode.placeholder = "Código de verificación";
  inputCode.maxLength = 6;
  inputCode.style.width = "100%";
  inputCode.style.padding = "10px";
  inputCode.style.textAlign = "center";

  const btnFinal = document.createElement("button");
  btnFinal.type = "button";
  btnFinal.textContent = "Validación final";
  btnFinal.style.marginTop = "10px";
  btnFinal.style.width = "100%";

  verifyBox.appendChild(verifyText);
  verifyBox.appendChild(inputCode);
  verifyBox.appendChild(btnFinal);

  let tempUserData = null;

  form.appendChild(inputApartment);
  form.appendChild(passContainer);
  form.appendChild(passRepeatContainer);
  form.appendChild(inputUser);
  form.appendChild(btnSubmit);
  container.appendChild(form);
  container.appendChild(verifyBox);

  // --- Botón volver ---
  const btnBack = document.createElement("button");
  btnBack.type = "button";
  btnBack.className = "register-back";
  btnBack.textContent = "Volver al Login";
  btnBack.addEventListener("click", (e) => {
    e.preventDefault();
    if (goToLogin) goToLogin();
  });
  container.appendChild(btnBack);

  // --- Mensaje de error ---
  const errorMsg = document.createElement("p");
  errorMsg.className = "register-error";
  errorMsg.style.display = "none";
  container.appendChild(errorMsg);

  // --- Paso 1: Enviar código de verificación ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const username = inputUser.value.trim();
    const password = inputPass.value.trim();
    const passwordRepeat = inputPassRepeat.value.trim();
    const apartmentNumber = inputApartment.value.trim();

    if (!apartmentNumber || !username || !password || !passwordRepeat) {
      errorMsg.textContent = "Por favor, completa todos los campos.";
      errorMsg.style.display = "block";
      return;
    }

    if (password !== passwordRepeat) {
      errorMsg.textContent = "Las contraseñas no coinciden";
      errorMsg.style.display = "block";
      return;
    }

    try {
      // 🔹 Enviar solo el código, sin crear usuario aún
      const res = await fetch('http://backend-1uwd.onrender.com/api/send-code', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      console.log("📡 Código enviado:", data);

      if (data.success) {
        tempUserData = { username, password, apartmentNumber };
        btnSubmit.style.display = "none";
        verifyBox.style.display = "block";
      } else {
        errorMsg.textContent = data.message || "No se pudo enviar el código.";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      errorMsg.textContent = "Error de conexión con el servidor.";
      errorMsg.style.display = "block";
    }
  });

  // --- Paso 2: Validación final ---
  btnFinal.addEventListener("click", async () => {
    const code = inputCode.value.trim();
    if (!code) {
      errorMsg.textContent = "Por favor ingresa el código recibido.";
      errorMsg.style.display = "block";
      return;
    }

    try {
      // Verificar código
      const res = await fetch('http://backend-1uwd.onrender.com/api/verify-code', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: tempUserData.username, code }),
      });

      const data = await res.json();

      if (data.success) {
        // 🔹 Crear el usuario solo si el código fue correcto
        const createRes = await fetch('https://backend-1uwd.onrender.com/api/register', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tempUserData),
        });
        const createData = await createRes.json();

        if (createData.success && onRegister) {
          onRegister(tempUserData);
        } else {
          errorMsg.textContent = "Error creando el usuario.";
          errorMsg.style.display = "block";
        }
      } else {
        errorMsg.textContent = data.message || "Código inválido o expirado";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      errorMsg.textContent = "Error verificando el código.";
      errorMsg.style.display = "block";
    }
  });

  return wrapper;
}
