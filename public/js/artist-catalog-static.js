let cart = JSON.parse(localStorage.getItem('cart')) || [];

const artistProducts = {
    'duki': [
        { id: 'duki-1', name: 'Remera Duki Negra', price: 15990, image: 'https://acdn-us.mitiendanube.com/stores/001/097/570/products/duki1-a82cb04dbd511ec96b16790858395459-640-0.jpg', artist: 'Duki', size: 'M', color: 'Negro' },
        { id: 'duki-2', name: 'Buzo Trap Duki', price: 32990, image: 'https://acdn-us.mitiendanube.com/stores/944/335/products/duki-2-ojo1-b409ab086dca94295b16069525378128-640-0.jpg', artist: 'Duki', size: 'M', color: 'Negro' },
        { id: 'duki-3', name: 'Gorra Duki', price: 8990, image: 'https://acdn-us.mitiendanube.com/stores/001/473/111/products/gorra-trucker-duki-n1-338553cf980f0856ad16911593476862-640-0.jpg', artist: 'Duki', size: 'Única', color: 'Negro' },
        { id: 'duki-4', name: 'Remera Duki Blanca', price: 15990, image: 'https://ih1.redbubble.net/image.5240148851.5808/ssrco,classic_tee,womens_02,fafafa:ca443f4786,front,product_square,x600.1.jpg', artist: 'Duki', size: 'M', color: 'Blanco' },
        { id: 'duki-5', name: 'Mochila Duki', price: 19990, image: 'https://http2.mlstatic.com/D_NQ_NP_669773-MLU74166639031_012024-O.webp', artist: 'Duki', size: 'Única', color: 'Negro' }
    ],
    'emilia': [
        { id: 'emilia-1', name: 'Crop top Emilia', price: 14990, image: 'https://http2.mlstatic.com/D_NQ_NP_762794-MLA80516127023_112024-O.webp', artist: 'Emilia Mernes', size: 'M', color: 'Rosa' },
        { id: 'emilia-2', name: 'Buzo Emilia', price: 28990, image: 'https://acdn-us.mitiendanube.com/stores/003/378/771/products/7-46ce46673d692b4d3717174636224947-640-0.jpg', artist: 'Emilia Mernes', size: 'M', color: 'Beige' },
        { id: 'emilia-3', name: 'Tote bag Emilia', price: 7990, image: 'https://dcdn-us.mitiendanube.com/stores/005/146/649/products/totebag-emilia-a8aa225eab4e0521b117260137380414-480-0.jpg', artist: 'Emilia Mernes', size: 'Única', color: 'Beige' },
        { id: 'emilia-4', name: 'Remera Emilia Blanca', price: 13990, image: 'https://acdn-us.mitiendanube.com/stores/819/313/products/04db-3f54f6fc9a808ecff817102634546162-1024-1024.png', artist: 'Emilia Mernes', size: 'M', color: 'Blanco' },
        { id: 'emilia-5', name: 'Totebag Emilia', price: 9990, image: 'https://http2.mlstatic.com/D_NQ_NP_771987-MLA81926035617_012025-O.webp', artist: 'Emilia Mernes', size: 'Única', color: 'Beige' }
    ],
    'luck-ra': [
        { id: 'luck-ra-1', name: 'Remera Cuarteto Luck Ra', price: 14990, image: 'https://acdn-us.mitiendanube.com/stores/819/313/products/02db-20f2a82e097346c2ad17587394059025-1024-1024.png', artist: 'Luck Ra', size: 'M', color: 'Negro' },
        { id: 'luck-ra-2', name: 'Buzo Luck Ra', price: 43990, image: 'https://www.memoestampados.com/wp-content/uploads/2025/04/D_929706-MLU83867635722_042025-F-600x628.jpg', artist: 'Luck Ra', size: 'M', color: 'Negro' },
        { id: 'luck-ra-3', name: 'Gorra Luck Ra', price: 11990, image: 'https://http2.mlstatic.com/D_NQ_NP_961150-MLA78353450339_082024-O.webp', artist: 'Luck Ra', size: 'Única', color: 'Negro' },
        { id: 'luck-ra-4', name: 'Remera Luck Ra', price: 14990, image: 'https://http2.mlstatic.com/D_NQ_NP_889499-MLA83969642187_042025-O.webp', artist: 'Luck Ra', size: 'M', color: 'Negro' },
        { id: 'luck-ra-5', name: 'Remera blanca Luck Ra', price: 10990, image: 'https://http2.mlstatic.com/D_NQ_NP_975934-MLA81902971174_012025-O.webp', artist: 'Luck Ra', size: 'M', color: 'Blanco' }
    ],
    'tini': [
        { id: 'tini-1', name: 'Remera Tini', price: 21490, image: 'https://acdn-us.mitiendanube.com/stores/001/209/361/products/template-reme-frente-f34eb754ff0159bb8817089772144049-1024-1024.png', artist: 'Tini Stoessel', size: 'M', color: 'Negro' },
        { id: 'tini-2', name: 'Hoodie Tini', price: 41990, image: 'https://http2.mlstatic.com/D_NQ_NP_673015-MLA84080597923_042025-O.webp', artist: 'Tini Stoessel', size: 'M', color: 'Negro' },
        { id: 'tini-3', name: 'Remera tour Tini', price: 15990, image: 'https://acdn-us.mitiendanube.com/stores/001/097/570/products/tini-tini1-6862000637c445313e16625609423837-640-0.jpg', artist: 'Tini Stoessel', size: 'M', color: 'Negro' },
        { id: 'tini-4', name: 'Remera Tini Negra', price: 15490, image: 'https://acdn-us.mitiendanube.com/stores/001/097/570/products/whatsapp-image-2022-03-08-at-12-11-38-am1-d2ef9e09d06cd2419516468498026754-640-0.jpeg', artist: 'Tini Stoessel', size: 'M', color: 'Negro' },
        { id: 'tini-5', name: 'Vinilo Tini', price: 20990, image: 'https://akamai.sscdn.co/letras/360x360/albuns/b/3/8/7/1946911745420054.jpg', artist: 'Tini Stoessel', size: 'Única', color: 'Negro' }
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
