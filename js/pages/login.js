

// js/pages/login.js

export function LoginPage(onLogin, goToRegister) {
  // Crear estructura principal
  const wrapper = document.createElement("div");
  wrapper.className = "login-background";

  const container = document.createElement("div");
  container.className = "login-container";
  wrapper.appendChild(container);

  // Logo
  const logo = document.createElement("img");
  logo.src = "./assets/kiosko.jpg";
  logo.alt = "Kiosko logo";
  logo.className = "login-logo";
  container.appendChild(logo);

  // Título
  const title = document.createElement("h2");
  title.className = "login-title";
  title.textContent = "Iniciar sesión";
  container.appendChild(title);

  // Formulario
  const form = document.createElement("form");
  form.className = "login-form";

  const inputUser = document.createElement("input");
  inputUser.type = "text";
  inputUser.placeholder = "Usuario";

  const inputPass = document.createElement("input");
  inputPass.type = "password";
  inputPass.placeholder = "Contraseña";

  const btnSubmit = document.createElement("button");
  btnSubmit.type = "submit";
  btnSubmit.textContent = "Ingresar";

  form.appendChild(inputUser);
  form.appendChild(inputPass);
  form.appendChild(btnSubmit);
  container.appendChild(form);

  // Botón registrarse
  const btnRegister = document.createElement("button");
  btnRegister.className = "login-register";
  btnRegister.textContent = "Registrarse";
  btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    if (goToRegister) goToRegister();
  });
  container.appendChild(btnRegister);

  // Mensajes de error
  const errorMsg = document.createElement("p");
  errorMsg.className = "login-error";
  errorMsg.style.display = "none";
  container.appendChild(errorMsg);

  // Manejo del submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const username = inputUser.value.trim();
    const password = inputPass.value.trim();

    try {
      const res = await fetch('https://backend-1uwd.onrender.com/api/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Login exitoso:", data);
        if (onLogin) onLogin({ username: data.username, apartmentNumber: data.apartmentNumber });
      } else {
        errorMsg.textContent = "Credenciales inválidas";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      errorMsg.textContent = "Error de conexión con el servidor";
      errorMsg.style.display = "block";
    }
  });

  return wrapper;
}
