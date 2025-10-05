


document.addEventListener('DOMContentLoaded', function() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCartItems();
    updateCartTotal();
    checkUserAuthentication();
});

async function checkUserAuthentication() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const stripeCheckoutBtn = document.getElementById('stripeCheckoutBtn');
        
        if (user && stripeCheckoutBtn) {
            stripeCheckoutBtn.style.display = 'block';
        }
    } catch (error) {
        console.log('User not authenticated');
    }
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunos productos increíbles!</p>
                <a href="/" class="btn-primary">Seguir comprando</a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="artist">Por ${item.artist}</p>
                <p class="item-options">
                    ${item.size !== 'Única' ? `Talle: ${item.size}` : ''}
                    ${item.color ? ` | Color: ${item.color}` : ''}
                </p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity(${index}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-price">
                <p class="unit-price">$${item.price.toFixed(2)} c/u</p>
                <p class="total-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartTotal();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartTotal();
    updateCartCount();
    
    showNotification('Producto eliminado del carrito');
}

async function payWithStripe() {
    try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            showNotification('Debes iniciar sesión para pagar con Stripe', 'error');
            window.location.href = '/login';
            return;
        }

        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'error');
            return;
        }

        // Show loading state
        const stripeBtn = document.getElementById('stripeCheckoutBtn');
        const originalText = stripeBtn.innerHTML;
        stripeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        stripeBtn.disabled = true;

        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            showNotification('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
            window.location.href = '/login';
            return;
        }

        // Use the Remera luck ra product for Stripe payment
        const priceId = 'price_1SEyeiKZBjsmEk2LZrr7VNkD';
        
        // Create checkout session
        const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price_id: priceId,
                mode: 'payment',
                success_url: `${window.location.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${window.location.origin}/carrito`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al crear la sesión de pago');
        }

        // Redirect to Stripe Checkout
        if (data.url) {
            // Clear cart after successful payment initiation
            localStorage.setItem('cart', JSON.stringify([]));
            window.location.href = data.url;
        } else {
            throw new Error('No se recibió URL de pago');
        }

    } catch (error) {
        console.error('Error en checkout:', error);
        showNotification(error.message || 'Error al procesar el pago', 'error');
        
        // Reset button state
        const stripeBtn = document.getElementById('stripeCheckoutBtn');
        stripeBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pagar con Stripe';
        stripeBtn.disabled = false;
    }
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const envio = cart.reduce((sum, item) => sum + (item.quantity * 50), 0);
    const total = subtotal + envio;


    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = `$${subtotal.toFixed(2)}`;
    }


    const shippingElement = document.getElementById('cartShipping');
    if (shippingElement) {
        shippingElement.textContent = `$${envio.toFixed(2)}`;
    }


    const totalElement2 = document.getElementById('cartTotal2');
    if (totalElement2) {
        totalElement2.textContent = `$${total.toFixed(2)}`;
    }
    
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartTotal();
        updateCartCount();
        showNotification('Carrito vaciado');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    window.location.href = 'https://link.mercadopago.com.ar/merchshop';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}