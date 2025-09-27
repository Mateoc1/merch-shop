// controllers/productsController.js

const products = [
    {
        id: 1,
        name: "Bandana de Bad Bunny",
        price: 25.00,
        artist: "Bad Bunny",
        category: "accessories",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bandana oficial de Bad Bunny, 100% algodón",
        sizes: ["Única"],
        colors: ["Negro", "Blanco"]
    },
    {
        id: 2,
        name: "Buzo de Trueno",
        price: 45.00,
        artist: "Trueno",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Buzo con capucha oficial de Trueno",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris"]
    },
    {
        id: 3,
        name: "Taza de Duki",
        price: 15.00,
        artist: "Duki",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Taza de cerámica con diseño exclusivo de Duki",
        sizes: ["Única"],
        colors: ["Blanco", "Negro"]
    }
];

// Obtener todos los productos (con filtros)
const getProducts = (req, res) => {
    const { artist, category, search } = req.query;
    let filteredProducts = products;

    if (artist) {
        filteredProducts = filteredProducts.filter(p =>
            p.artist.toLowerCase().includes(artist.toLowerCase())
        );
    }

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.artist.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.json(filteredProducts);
};

// Obtener producto por ID
const getProductById = (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
};

module.exports = {
    getProducts,
    getProductById
};
