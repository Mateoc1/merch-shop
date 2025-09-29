


document.addEventListener('DOMContentLoaded', function() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCartItems();
    updateCartTotal();
});

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
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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