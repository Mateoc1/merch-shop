let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentArtist = null;
let allProducts = [];

document.addEventListener('DOMContentLoaded', async function() {
    updateCartCount();
    await loadArtistAndProducts();
    setupEventListeners();
});

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function setupEventListeners() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('searchInput').value;
            filterProducts(null, searchTerm);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterProducts(category === 'all' ? null : category);
        });
    });

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

async function loadArtistAndProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistSlug = urlParams.get('artist');

    if (!artistSlug) {
        window.location.href = '/artistas';
        return;
    }

    try {
        const { data: artist, error: artistError } = await supabase
            .from('artists')
            .select('*')
            .eq('slug', artistSlug)
            .maybeSingle();

        if (artistError) throw artistError;

        if (!artist) {
            window.location.href = '/artistas';
            return;
        }

        currentArtist = artist;
        displayArtistInfo(artist);

        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('artist_id', artist.id)
            .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        allProducts = products || [];
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Error al cargar los datos. Por favor, intenta de nuevo.');
    }
}

function displayArtistInfo(artist) {
    document.getElementById('artistName').textContent = artist.name;
    document.getElementById('artistDescription').textContent = artist.description;
    document.getElementById('artistImage').src = artist.image_url;
    document.getElementById('artistImage').alt = artist.name;
    document.title = `${artist.name} - Merch Shop`;
}

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!products || products.length === 0) {
        productsGrid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    productsGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}" loading="lazy">
                ${product.stock_quantity === 0 ? '<span class="out-of-stock-badge">Agotado</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn-view" onclick="showProductDetails('${product.id}')">
                        <i class="fas fa-eye"></i> Ver detalles
                    </button>
                    ${product.stock_quantity > 0 ? `
                        <button class="btn-add" onclick="addToCart('${product.id}')">
                            <i class="fas fa-shopping-cart"></i> Agregar
                        </button>
                    ` : `
                        <button class="btn-disabled" disabled>
                            <i class="fas fa-ban"></i> No disponible
                        </button>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category, searchTerm) {
    let filtered = [...allProducts];

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
    }

    displayProducts(filtered);
}

async function showProductDetails(productId) {
    try {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div class="product-details">
                <div class="product-detail-image">
                    <img src="${product.image_url}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="artist-name">Por ${currentArtist.name}</p>
                    <p class="detail-price">$${parseFloat(product.price).toFixed(2)}</p>
                    <p class="detail-description">${product.description}</p>

                    ${product.stock_quantity > 0 ? `
                        <div class="product-options">
                            ${product.sizes && product.sizes.length > 1 ? `
                                <div class="option-group">
                                    <label>Talle:</label>
                                    <select id="sizeSelect">
                                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                                    </select>
                                </div>
                            ` : ''}

                            ${product.colors && product.colors.length > 1 ? `
                                <div class="option-group">
                                    <label>Color:</label>
                                    <select id="colorSelect">
                                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                                    </select>
                                </div>
                            ` : ''}

                            <div class="option-group">
                                <label>Cantidad:</label>
                                <input type="number" id="quantityInput" value="1" min="1" max="${Math.min(product.stock_quantity, 10)}">
                            </div>
                        </div>

                        <button class="btn-primary btn-large" onclick="addToCartFromModal('${product.id}')">
                            <i class="fas fa-shopping-cart"></i> Agregar al carrito
                        </button>
                    ` : `
                        <div class="out-of-stock-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Este producto está agotado actualmente</p>
                        </div>
                    `}
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
        const product = allProducts.find(p => p.id === productId);
        if (!product || product.stock_quantity === 0) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image_url,
                artist: currentArtist.name,
                quantity: 1,
                size: product.sizes[0],
                color: product.colors[0]
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Producto agregado al carrito');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

function addToCartFromModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || product.stock_quantity === 0) return;

    const sizeSelect = document.getElementById('sizeSelect');
    const colorSelect = document.getElementById('colorSelect');
    const quantityInput = document.getElementById('quantityInput');

    const size = sizeSelect ? sizeSelect.value : product.sizes[0];
    const color = colorSelect ? colorSelect.value : product.colors[0];
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    const existingItem = cart.find(item =>
        item.id === productId && item.size === size && item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image_url,
            artist: currentArtist.name,
            quantity: quantity,
            size: size,
            color: color
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    document.getElementById('productModal').style.display = 'none';
    showNotification(`${quantity} producto(s) agregado(s) al carrito`);
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

function showError(message) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
}
