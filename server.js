require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "merch-shop-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Sample products data
const products = [
    {
        id: 1,
        name: "Remera Oficial Duki",
        price: 3500,
        artist: "Duki",
        artist_slug: "duki",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Remera oficial de Duki, 100% algodón premium",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco"],
        stock: 50
    },
    {
        id: 2,
        name: "Buzo Trap Duki",
        price: 5500,
        artist: "Duki",
        artist_slug: "duki",
        category: "clothing",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Buzo con capucha oficial de Duki",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris"],
        stock: 30
    },
    {
        id: 3,
        name: "Gorra Duki",
        price: 2500,
        artist: "Duki",
        artist_slug: "duki",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Gorra oficial con logo de Duki",
        sizes: ["Única"],
        colors: ["Negro", "Blanco"],
        stock: 25
    },
    {
        id: 4,
        name: "Crop Top Emilia",
        price: 2800,
        artist: "Emilia Mernes",
        artist_slug: "emilia-mernes",
        category: "clothing",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Crop top oficial de Emilia Mernes",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Rosa", "Blanco"],
        stock: 40
    },
    {
        id: 5,
        name: "Tote Bag Emilia",
        price: 1800,
        artist: "Emilia Mernes",
        artist_slug: "emilia-mernes",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bolsa de tela oficial de Emilia Mernes",
        sizes: ["Única"],
        colors: ["Rosa", "Negro"],
        stock: 35
    },
    {
        id: 6,
        name: "Remera Tour Tini",
        price: 3200,
        artist: "Tini Stoessel",
        artist_slug: "tini-stoessel",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Remera oficial del tour de Tini",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco", "Rosa"],
        stock: 45
    },
    {
        id: 7,
        name: "Vinilo Tini",
        price: 4500,
        artist: "Tini Stoessel",
        artist_slug: "tini-stoessel",
        category: "records",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Vinilo oficial del último álbum de Tini",
        sizes: ["Única"],
        colors: ["Negro"],
        stock: 20
    },
    {
        id: 8,
        name: "Remera Cuarteto Luck Ra",
        price: 3000,
        artist: "Luck Ra",
        artist_slug: "luck-ra",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Remera oficial de Luck Ra con diseño cuarteto",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 30
    },
    {
        id: 9,
        name: "Bandana Luck Ra",
        price: 1500,
        artist: "Luck Ra",
        artist_slug: "luck-ra",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bandana oficial de Luck Ra",
        sizes: ["Única"],
        colors: ["Negro", "Rojo"],
        stock: 40
    }
];

// Users data (simple file-based storage)
let users = [];

// Routes

// Serve main pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/index.html"));
});

app.get("/artistas", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/artistas.html"));
});

app.get("/carrito", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/carrito.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/nuevolog.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/register.html"));
});

app.get("/ayuda", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/ayuda.html"));
});

app.get("/catalogo-artista", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/catalogo-artista.html"));
});

app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/checkout.html"));
});

app.get("/order-success", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/order-success.html"));
});

// API Routes

// Get all products with filtering
app.get("/api/products", (req, res) => {
    try {
        const { artist, category, search } = req.query;
        let filteredProducts = [...products];

        if (artist) {
            filteredProducts = filteredProducts.filter(p =>
                p.artist_slug === artist || p.artist.toLowerCase().includes(artist.toLowerCase())
            );
        }

        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.artist.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        res.json(filteredProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Error fetching products" });
    }
});

// Get single product by ID
app.get("/api/products/:id", (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Error fetching product" });
    }
});

// Authentication routes

// Register
app.post("/auth/register", (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        if (!nombre || !email || !password) {
            return res.status(400).send("Todos los campos son requeridos");
        }
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).send("Ese usuario ya existe");
        }
        
        // Add new user
        const newUser = { id: users.length + 1, nombre, email, password };
        users.push(newUser);
        
        console.log("Usuario registrado:", newUser);
        res.status(201).send("Usuario registrado con éxito");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Error en el registro");
    }
});

// Login
app.post("/auth/login", (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).send("Email y contraseña son requeridos");
        }
        
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).send("Credenciales incorrectas");
        }
        
        req.session.user = user;
        console.log("Usuario logueado:", user);
        res.status(200).send("Login exitoso");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Error en el login");
    }
});

// Get current user
app.get("/auth/me", (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: "No hay usuario logueado" });
    }
});

// Logout
app.get("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error al cerrar sesión");
        }
        res.status(200).send("Logout exitoso");
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`🚀 Merch Shop server running at http://localhost:${port}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, "public")}`);
    console.log(`🛍️  Products loaded: ${products.length} items`);
});