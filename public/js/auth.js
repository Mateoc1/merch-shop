let supabase;

async function initSupabase() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();

    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      throw new Error('Configuración de Supabase no disponible');
    }

    supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    return supabase;
  } catch (error) {
    console.error('Error al inicializar Supabase:', error);
    showMessage('Error de configuración. Por favor recarga la página.', 'error');
    throw error;
  }
}

// Registration form handler
async function setupRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!supabase) {
        showMessage("Inicializando... por favor espera", "error");
        return;
      }

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Validate passwords match
      if (password !== confirmPassword) {
        showMessage("Las contraseñas no coinciden", "error");
        return;
      }

      try {
        // Show loading state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
        submitButton.disabled = true;

        // Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        });

        if (authError) throw authError;

        // Insert additional user data into profiles table
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email: email,
                first_name: firstName,
                last_name: lastName
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        showMessage("Registro exitoso. Ahora puedes iniciar sesión.", "success");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);

      } catch (error) {
        console.error('Registration error:', error);
        showMessage(error.message || "Error en el registro", "error");

        // Reset button state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  }
}

// Login form handler
async function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!supabase) {
        showMessage("Inicializando... por favor espera", "error");
        return;
      }

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        submitButton.disabled = true;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) throw error;

        showMessage("Login exitoso", "success");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

      } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message || "Credenciales incorrectas", "error");

        // Reset button state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  }
}

// Check user authentication status
async function checkUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const displayName = profile ? profile.first_name : user.email.split('@')[0];

      // Update UI for logged in user
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameDisplay) {
        usernameDisplay.textContent = ` ${displayName}`;
      }

      // Show logout button
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", logout);
      }

      // Update login link
      const loginLink = document.getElementById("loginLink");
      if (loginLink) {
        loginLink.href = "#";
        loginLink.addEventListener("click", (e) => {
          e.preventDefault();
        });
      }

      // Check and display subscription status
      checkSubscriptionStatus();
    }
  } catch (err) {
    console.log("No active session");
  }
}

// Check subscription status
async function checkSubscriptionStatus() {
  try {
    const { data: subscription, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return;
    }

    // Display subscription status
    displaySubscriptionStatus(subscription);

  } catch (error) {
    console.error('Error checking subscription:', error);
  }
}

// Display subscription status
function displaySubscriptionStatus(subscription) {
  // Create subscription status element if it doesn't exist
  let subscriptionDisplay = document.getElementById('subscriptionStatus');
  
  if (!subscriptionDisplay) {
    subscriptionDisplay = document.createElement('div');
    subscriptionDisplay.id = 'subscriptionStatus';
    subscriptionDisplay.className = 'subscription-status';
    
    // Insert after header
    const header = document.querySelector('.header');
    if (header) {
      header.insertAdjacentElement('afterend', subscriptionDisplay);
    }
  }

  if (subscription && subscription.subscription_status === 'active') {
    subscriptionDisplay.innerHTML = `
      <div class="subscription-active">
        <i class="fas fa-check-circle"></i>
        <span>Suscripción activa: Remera luck ra</span>
      </div>
    `;
    subscriptionDisplay.style.display = 'block';
  } else {
    subscriptionDisplay.style.display = 'none';
  }
}

// Logout function
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    showMessage("Sesión cerrada exitosamente", "success");
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (err) {
    console.error("Error cerrando sesión:", err);
    showMessage("Error al cerrar sesión", "error");
  }
}

// Show message function
function showMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.auth-message');
  existingMessages.forEach(msg => msg.remove());

  const messageDiv = document.createElement('div');
  messageDiv.className = `auth-message ${type}`;
  messageDiv.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    ${message}
  `;
  
  // Insert at the top of the form or body
  const form = document.querySelector('.glass-card') || document.body;
  form.insertBefore(messageDiv, form.firstChild);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Initialize Supabase and set up auth
(async function() {
  try {
    await initSupabase();

    // Setup form handlers
    setupRegisterForm();
    setupLoginForm();

    // Auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        // Clear subscription status
        const subscriptionDisplay = document.getElementById('subscriptionStatus');
        if (subscriptionDisplay) {
          subscriptionDisplay.style.display = 'none';
        }
      }
    });

    // Initialize on page load
    checkUser();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
})();