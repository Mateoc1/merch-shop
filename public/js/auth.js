// registro
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });

    if (res.ok) {
      alert("Registro exitoso, ahora podés iniciar sesión");
      window.location.href = "/login";
    } else {
      alert(await res.text());
    }
  });
}

// login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      alert("Login exitoso");
      window.location.href = "/";
    } else {
      alert(await res.text());
    }
  });
}

// mostrar nombre de usuario si hay sesion 
async function checkUser() {
  try {
    const res = await fetch("/auth/me");
    if (res.ok) {
      const user = await res.json();

      //muestra nombre de usuario
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameDisplay) usernameDisplay.textContent = " " + user.nombre;

      //muestra el boton para deslogearse
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", logout);
      }

      
      const loginLink = document.getElementById("loginLink");
      if (loginLink) loginLink.href = "#";
    }
  } catch (err) {
    console.log("No hay sesión activa");
  }
}

async function logout() {
  try {
    const res = await fetch("/auth/logout", { method: "GET" });
    if (res.ok) {
      window.location.href = "/"; // redirigir a home
    }
  } catch (err) {
    console.error("Error cerrando sesión:", err);
  }
}



checkUser();
