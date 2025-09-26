// Checkout functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    if (cart.length === 0) {
        window.location.href = 'carrito.html';
        return;
    }
    
    displayOrderSummary();
    setupFormHandlers();
});

function displayOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    // Display items
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.artist}</p>
                <p class="item-details">
                    ${item.size !== 'Única' ? `Talle: ${item.size}` : ''}
                    ${item.color ? ` | Color: ${item.color}` : ''}
                    | Cantidad: ${item.quantity}
                </p>
            </div>
            <div class="item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;
}

function setupFormHandlers() {
    const form = document.getElementById('checkoutForm');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    // Payment method toggle
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                cardDetails.style.display = 'block';
                setCardFieldsRequired(true);
            } else {
                cardDetails.style.display = 'none';
                setCardFieldsRequired(false);
            }
        });
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        this.value = formattedValue;
    });
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    expiryInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });
    
    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
}

function setCardFieldsRequired(required) {
    const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    cardFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (required) {
            field.setAttribute('required', '');
        } else {
            field.removeAttribute('required');
        }
    });
}

function processOrder() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitButton.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Create order object
        const order = {
            id: generateOrderId(),
            items: cart,
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            shipping: {
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postalCode'),
                province: formData.get('province')
            },
            payment: {
                method: formData.get('paymentMethod')
            },
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };
        
        // Save order to localStorage (in a real app, this would be sent to a server)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to success page
        window.location.href = `order-success.html?orderId=${order.id}`;
        
    }, 2000);
}

function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}