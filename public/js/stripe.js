// Stripe integration functionality
const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Stripe products configuration
const stripeProducts = [
  {
    priceId: 'price_1SEyeiKZBjsmEk2LZrr7VNkD',
    name: 'Remera luck ra',
    description: 'hola',
    mode: 'subscription'
  }
];

// Initialize Stripe functionality
document.addEventListener('DOMContentLoaded', function() {
  displayStripeProducts();
  checkUserSubscription();
});

// Display Stripe products on the page
function displayStripeProducts() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  const stripeProductsHTML = stripeProducts.map(product => `
    <div class="product-card stripe-product" data-price-id="${product.priceId}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-type">${product.mode === 'subscription' ? 'Suscripción' : 'Compra única'}</p>
        <div class="product-actions">
          <button class="btn-primary" onclick="handleStripeCheckout('${product.priceId}', '${product.mode}')">
            ${product.mode === 'subscription' ? 'Suscribirse' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Add Stripe products to existing products
  productGrid.innerHTML += stripeProductsHTML;
}

// Handle Stripe checkout
async function handleStripeCheckout(priceId, mode) {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showNotification('Debes iniciar sesión para realizar una compra', 'error');
      window.location.href = '/login';
      return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    button.disabled = true;

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showNotification('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
      window.location.href = '/login';
      return;
    }

    // Create checkout session
    const response = await fetch(`${SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: priceId,
        mode: mode,
        success_url: `${window.location.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear la sesión de pago');
    }

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No se recibió URL de pago');
    }

  } catch (error) {
    console.error('Error en checkout:', error);
    showNotification(error.message || 'Error al procesar el pago', 'error');
    
    // Reset button state
    const button = event.target;
    button.innerHTML = mode === 'subscription' ? 'Suscribirse' : 'Comprar';
    button.disabled = false;
  }
}

// Check user subscription status
async function checkUserSubscription() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    // Get user subscription
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

// Display subscription status in UI
function displaySubscriptionStatus(subscription) {
  const subscriptionDisplay = document.getElementById('subscriptionStatus');
  
  if (!subscriptionDisplay) return;

  if (subscription && subscription.subscription_status === 'active') {
    const product = stripeProducts.find(p => p.priceId === subscription.price_id);
    const productName = product ? product.name : 'Suscripción activa';
    
    subscriptionDisplay.innerHTML = `
      <div class="subscription-active">
        <i class="fas fa-check-circle"></i>
        <span>Plan activo: ${productName}</span>
      </div>
    `;
    subscriptionDisplay.style.display = 'block';
  } else {
    subscriptionDisplay.style.display = 'none';
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Make functions globally available
window.handleStripeCheckout = handleStripeCheckout;