// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadProducts();
    setupEventListeners();
    initializeSupabase();
});

function initializeSupabase() {
    // Initialize Supabase if not already done
    if (typeof window.supabase === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        document.head.appendChild(script);
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

function setupEventListeners() {
    // Search functionality
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('searchInput').value;
            loadProducts(null, searchTerm);
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            loadProducts(filter === 'all' ? null : filter);
        });
    });

    // Category dropdown
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });

    // Modal functionality
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

async function loadProducts(category = null, search = null) {
    try {
        let url = '/api/products';
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const products = await response.json();
        
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No se encontraron productos</p>';
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p class="artist">Por ${product.artist}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="btn-primary" onclick="showProductDetails(${product.id})">Ver detalles</button>
                <button class="btn-secondary" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
            </div>
        </div>
    `).join('');
}

async function showProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div class="product-details">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p class="artist">Por ${product.artist}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    
                    <div class="product-options">
                        ${product.sizes.length > 1 ? `
                            <div class="option-group">
                                <label>Talle:</label>
                                <select id="sizeSelect">
                                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                                </select>
                            </div>
                        ` : ''}
                        
                        ${product.colors.length > 1 ? `
                            <div class="option-group">
                                <label>Color:</label>
                                <select id="colorSelect">
                                    ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                                </select>
                            </div>
                        ` : ''}
                        
                        <div class="option-group">
                            <label>Cantidad:</label>
                            <input type="number" id="quantityInput" value="1" min="1" max="10">
                        </div>
                    </div>
                    
                    <button class="btn-primary btn-large" onclick="addToCartFromModal(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('productModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

async function addToCart(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                artist: product.artist,
                quantity: 1,
                size: product.sizes[0],
                color: product.colors[0]
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showNotification('Producto agregado al carrito');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

function addToCartFromModal(productId) {
    const sizeSelect = document.getElementById('sizeSelect');
    const colorSelect = document.getElementById('colorSelect');
    const quantityInput = document.getElementById('quantityInput');
    
    const size = sizeSelect ? sizeSelect.value : 'Única';
    const color = colorSelect ? colorSelect.value : 'Negro';
    const quantity = parseInt(quantityInput.value);
    
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const cartKey = `${productId}-${size}-${color}`;
            const existingItem = cart.find(item => 
                item.id === productId && item.size === size && item.color === color
            );
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    artist: product.artist,
                    quantity: quantity,
                    size: size,
                    color: color
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Close modal and show success message
            document.getElementById('productModal').style.display = 'none';
            showNotification(`${quantity} producto(s) agregado(s) al carrito`);
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
        });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}