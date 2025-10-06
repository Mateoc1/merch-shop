let cart = JSON.parse(localStorage.getItem('cart')) || [];

const artistProducts = {
    'duki': [
        { id: 'duki-1', name: 'Remera Duki Negra', price: 15990, image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', artist: 'Duki', size: 'M', color: 'Negro' },
        { id: 'duki-2', name: 'Hoodie Duki', price: 32990, image: 'https://images.pexels.com/photos/6898856/pexels-photo-6898856.jpeg', artist: 'Duki', size: 'M', color: 'Negro' },
        { id: 'duki-3', name: 'Gorra Duki', price: 8990, image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', artist: 'Duki', size: 'Única', color: 'Negro' },
        { id: 'duki-4', name: 'Remera Duki Blanca', price: 15990, image: 'https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg', artist: 'Duki', size: 'M', color: 'Blanco' },
        { id: 'duki-5', name: 'Mochila Duki', price: 19990, image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg', artist: 'Duki', size: 'Única', color: 'Negro' }
    ],
    'emilia': [
        { id: 'emilia-1', name: 'Remera Emilia Rosa', price: 14990, image: 'https://images.pexels.com/photos/8532620/pexels-photo-8532620.jpeg', artist: 'Emilia Mernes', size: 'M', color: 'Rosa' },
        { id: 'emilia-2', name: 'Buzo Emilia', price: 28990, image: 'https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg', artist: 'Emilia Mernes', size: 'M', color: 'Beige' },
        { id: 'emilia-3', name: 'Riñonera Emilia', price: 7990, image: 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg', artist: 'Emilia Mernes', size: 'Única', color: 'Rosa' },
        { id: 'emilia-4', name: 'Remera Emilia Blanca', price: 13990, image: 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg', artist: 'Emilia Mernes', size: 'M', color: 'Blanco' },
        { id: 'emilia-5', name: 'Totebag Emilia', price: 9990, image: 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg', artist: 'Emilia Mernes', size: 'Única', color: 'Beige' }
    ],
    'luck-ra': [
        { id: 'luck-ra-1', name: 'Remera Luck Ra', price: 14990, image: 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg', artist: 'Luck Ra', size: 'M', color: 'Negro' },
        { id: 'luck-ra-2', name: 'Buzo Luck Ra', price: 29990, image: 'https://images.pexels.com/photos/6764045/pexels-photo-6764045.jpeg', artist: 'Luck Ra', size: 'M', color: 'Negro' },
        { id: 'luck-ra-3', name: 'Gorra Luck Ra', price: 8990, image: 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg', artist: 'Luck Ra', size: 'Única', color: 'Negro' },
        { id: 'luck-ra-4', name: 'Remera Luck Ra Blanca', price: 14990, image: 'https://images.pexels.com/photos/8532615/pexels-photo-8532615.jpeg', artist: 'Luck Ra', size: 'M', color: 'Blanco' },
        { id: 'luck-ra-5', name: 'Visera Luck Ra', price: 6990, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', artist: 'Luck Ra', size: 'Única', color: 'Negro' }
    ],
    'tini': [
        { id: 'tini-1', name: 'Remera Tini Violeta', price: 15490, image: 'https://images.pexels.com/photos/8532621/pexels-photo-8532621.jpeg', artist: 'Tini Stoessel', size: 'M', color: 'Violeta' },
        { id: 'tini-2', name: 'Hoodie Tini', price: 31990, image: 'https://images.pexels.com/photos/6764043/pexels-photo-6764043.jpeg', artist: 'Tini Stoessel', size: 'M', color: 'Negro' },
        { id: 'tini-3', name: 'Gorra Tini', price: 8490, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', artist: 'Tini Stoessel', size: 'Única', color: 'Beige' },
        { id: 'tini-4', name: 'Remera Tini Negra', price: 15490, image: 'https://images.pexels.com/photos/8532618/pexels-photo-8532618.jpeg', artist: 'Tini Stoessel', size: 'M', color: 'Negro' },
        { id: 'tini-5', name: 'Botella Tini', price: 11990, image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg', artist: 'Tini Stoessel', size: 'Única', color: 'Rosa' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    attachAddToCartListeners();
});

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function attachAddToCartListeners() {
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const artistSlug = getArtistSlug();
            const products = artistProducts[artistSlug];
            if (products && products[index]) {
                addToCart(products[index]);
            }
        });
    });
}

function getArtistSlug() {
    const path = window.location.pathname;
    if (path.includes('duki')) return 'duki';
    if (path.includes('emilia')) return 'emilia';
    if (path.includes('luck-ra')) return 'luck-ra';
    if (path.includes('tini')) return 'tini';
    return null;
}

function addToCart(product) {
    const existingItem = cart.find(item =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
    );

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
            size: product.size,
            color: product.color
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Producto agregado al carrito');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
