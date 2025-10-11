
// js/pages/register.js

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

  const inputUser = document.createElement("input");
  inputUser.type = "text";
  inputUser.placeholder = "Usuario";

  const inputPass = document.createElement("input");
  inputPass.type = "password";
  inputPass.placeholder = "Contraseña";

  const inputApartment = document.createElement("input");
  inputApartment.type = "text";
  inputApartment.placeholder = "Número de apartamento";

  const btnSubmit = document.createElement("button");
  btnSubmit.type = "submit"; // ✅ este sí es submit
  btnSubmit.textContent = "Registrar";

  form.appendChild(inputUser);
  form.appendChild(inputPass);
  form.appendChild(inputApartment);
  form.appendChild(btnSubmit);
  container.appendChild(form);

  const btnBack = document.createElement("button");
  btnBack.type = "button"; // ✅ evitar que este actúe como submit
  btnBack.className = "register-back";
  btnBack.textContent = "Volver al Login";
  btnBack.addEventListener("click", (e) => {
    e.preventDefault();
    if (goToLogin) goToLogin();
  });
  container.appendChild(btnBack);

  const errorMsg = document.createElement("p");
  errorMsg.className = "register-error";
  errorMsg.style.display = "none";
  container.appendChild(errorMsg);

  // Manejo del submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const username = inputUser.value.trim();
    const password = inputPass.value.trim();
    const apartmentNumber = inputApartment.value.trim();

    try {
      const res = await fetch('https://backend-1uwd.onrender.com/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, apartmentNumber }),
      });

      const data = await res.json();
      console.log("📡 data recibido:", data);

      if (data.success) {
        // Guardar en localStorage
        localStorage.setItem("apartmentNumber", data.apartmentNumber || apartmentNumber);

        if (onRegister) {
          onRegister({
            username: data.username || username,
            apartmentNumber: data.apartmentNumber || apartmentNumber,
          });
        }
      } else {
        errorMsg.textContent = data.message || "No se pudo registrar";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      errorMsg.textContent = "Error de conexión con el servidor";
      errorMsg.style.display = "block";
    }
  });

  return wrapper;
}
