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
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameDisplay) {
        usernameDisplay.textContent = " " + user.nombre; // 👈 agrega el nombre
      }

      // si hay usuario, el link ya no debería ir al login
      const loginLink = document.getElementById("loginLink");
      if (loginLink) {
        loginLink.href = "/"; 
      }
    }
  } catch (err) {
    console.log("No hay usuario logueado");
  }
}

checkUser();
