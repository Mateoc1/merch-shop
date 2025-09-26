require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.get('/artistas', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/artistas.html'));
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/carrito.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/nuevolog.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

app.get('/ayuda', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/ayuda.html'));
});

// API Routes for products
app.get('/api/products', (req, res) => {
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
        },
        {
            id: 4,
            name: "Remera de Emilia",
            price: 30.00,
            artist: "Emilia",
            category: "clothing",
            image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Remera oficial de Emilia Mernes",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Rosa", "Blanco", "Negro"]
        },
        {
            id: 5,
            name: "Vinilo de Tini",
            price: 35.00,
            artist: "Tini",
            category: "records",
            image: "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Disco de vinilo del último álbum de Tini",
            sizes: ["Única"],
            colors: ["Negro"]
        },
        {
            id: 6,
            name: "Gorra de Luck Ra",
            price: 20.00,
            artist: "Luck Ra",
            category: "accessories",
            image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Gorra snapback oficial de Luck Ra",
            sizes: ["Única"],
            colors: ["Negro", "Azul", "Rojo"]
        }
    ];
    
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
});

app.get('/api/products/:id', (req, res) => {
    const products = [
        {
            id: 1,
            name: "Bandana de Bad Bunny",
            price: 25.00,
            artist: "Bad Bunny",
            category: "accessories",
            image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Bandana oficial de Bad Bunny, 100% algodón. Perfecta para completar tu look urbano.",
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
            description: "Buzo con capucha oficial de Trueno. Material de alta calidad, perfecto para el invierno.",
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
            description: "Taza de cerámica con diseño exclusivo de Duki. Capacidad 350ml, apta para microondas.",
            sizes: ["Única"],
            colors: ["Blanco", "Negro"]
        }
    ];
    
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));