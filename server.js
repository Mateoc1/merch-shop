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
        price: 13500,
        artist: "Duki",
        artist_slug: "duki",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/001/097/570/products/duki1-a82cb04dbd511ec96b16790858395459-1024-1024.jpg",
        description: "Remera oficial de Duki, 100% algodón premium",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco"],
        stock: 50
    },
    {
        id: 2,
        name: "Buzo Trap Duki",
        price: 25500,
        artist: "Duki",
        artist_slug: "duki",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/944/335/products/duki-2-ojo1-b409ab086dca94295b16069525378128-640-0.jpg",
        description: "Buzo con capucha oficial de Duki",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris"],
        stock: 30
    },
    {
        id: 3,
        name: "Gorra Duki",
        price: 12500,
        artist: "Duki",
        artist_slug: "duki",
        category: "accessories",
        image: "https://acdn-us.mitiendanube.com/stores/001/473/111/products/gorra-trucker-duki-n1-338553cf980f0856ad16911593476862-640-0.jpg",
        description: "Gorra oficial con logo de Duki",
        sizes: ["Única"],
        colors: ["Negro", "Blanco"],
        stock: 25
    },
    {
        id: 4,
        name: "Crop Top Emilia",
        price: 22800,
        artist: "Emilia Mernes",
        artist_slug: "emilia-mernes",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/003/378/771/products/17-5aec242088b500f68d17038923140361-1024-1024.jpg",
        description: "Crop top oficial de Emilia Mernes",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Rosa", "Blanco"],
        stock: 40
    },
    {
        id: 5,
        name: "Tote Bag Emilia",
        price: 81800,
        artist: "Emilia Mernes",
        artist_slug: "emilia-mernes",
        category: "accessories",
        image: "https://dcdn-us.mitiendanube.com/stores/005/146/649/products/totebag-emilia-a8aa225eab4e0521b117260137380414-480-0.jpg",
        description: "Bolsa de tela oficial de Emilia Mernes",
        sizes: ["Única"],
        colors: ["Rosa", "Negro"],
        stock: 35
    },
    {
        id: 6,
        name: "Remera Tour Tini",
        price: 13200,
        artist: "Tini Stoessel",
        artist_slug: "tini-stoessel",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/001/097/570/products/tini-tini1-6862000637c445313e16625609423837-640-0.jpg",
        description: "Remera oficial del tour de Tini",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco", "Rosa"],
        stock: 45
    },
    {
        id: 7,
        name: "Vinilo Tini",
        price: 30500,
        artist: "Tini Stoessel",
        artist_slug: "tini-stoessel",
        category: "records",
        image: "https://akamai.sscdn.co/uploadfile/letras/albuns/b/3/8/7/1946911745420054.jpg",
        description: "Vinilo oficial del último álbum de Tini",
        sizes: ["Única"],
        colors: ["Negro"],
        stock: 20
    },
    {
        id: 8,
        name: "Remera Cuarteto Luck Ra",
        price: 13000,
        artist: "Luck Ra",
        artist_slug: "luck-ra",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/819/313/products/02db-20f2a82e097346c2ad17587394059025-1024-1024.png",
        description: "Remera oficial de Luck Ra con diseño cuarteto",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blanco", "Gris"],
        stock: 30
    },
    {
        id: 9,
        name: "Buzo Luck Ra",
        price: 8500,
        artist: "Luck Ra",
        artist_slug: "luck-ra",
        category: "clothing",
        image: "https://www.memoestampados.com/wp-content/uploads/2025/04/D_929706-MLU83867635722_042025-F-600x628.jpg",
        description: "Buzo oficial de Luck Ra",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco"],
        stock: 40
    },
    {
        id: 10,
        name: "Tazas de Abel Pintos",
        price: 17500,
        artist: "Abel Pintos",
        artist_slug: "abel-pintos",
        category: "accessories",
        image: "https://d22fxaf9t8d39k.cloudfront.net/6d4e38c663a1c4e54bc5732aff1b4cb160dddd466f592e70d84a3a3699e1a3f6193797.jpg",
        description: "Tazas oficiales de Abel Pintos",
        sizes: ["Única"],
        colors: ["Negro"],
        stock: 50
    },
    {
        id: 11,
        name: "Remera Abel Pintos",
        price: 15000,
        artist: "Abel Pintos",
        artist_slug: "abel-pintos",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/944/335/products/abel-pintos-2-azul1-36b1d1f956d7b0dd2d15512191809334-1024-1024.jpg",
        description: "Remera oficial de Abel Pintos",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 50
    },
    {
        id: 12,
        name: "Buzo de Milo J",
        price: 25000,
        artist: "Milo J",
        artist_slug: "milo-j",
        category: "clothing",
        image: "https://http2.mlstatic.com/D_727646-MLA81145144442_122024-O.jpg",
        description: "Buzo oficial de Milo J",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 30
    },
    {
        id: 13,
        name: "Remera Milo J",
        price: 13000,
        artist: "Milo J",
        artist_slug: "milo-j",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/005/882/096/products/d_966174-mla78338029305_082024-o-e98bcfbab4b859960e17408658187280-1024-1024.jpg",
        description: "Remera oficial de Milo J",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 35
    },
    {
        id: 14,
        name: "Gorra de Bizarrap",
        price: 9500,
        artist: "Bizarrap",
        artist_slug: "bizarrap",
        category: "accessories",
        image: "https://d22fxaf9t8d39k.cloudfront.net/0710074415e08efcc7a982a87b0520fd33d5705c61af7d83d916cdf849110f35132301.png",
        description: "Gorra oficial de Bizarrap",
        sizes: ["Única"],
        colors: ["Negro", "Azul"],
        stock: 50
    },
    {
        id: 15,
        name: "Remera Bizarrap",
        price: 14000,
        artist: "Bizarrap",
        artist_slug: "bizarrap",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/002/878/365/products/foto-producto-espalda-biza1-4ba531d1fa2c03f5f216819385379545-1024-1024.jpg",
        description: "Remera oficial de Bizarrap",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 30
    },
    {
        id: 16,
        name: "Brazalete Charly Garcia",
        price: 6000,
        artist: "Charly Garcia",
        artist_slug: "charly-garcia",
        category: "accessories",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqBka_76urw9cfoHC1Uf41VykV_SJH1EHBiA&s",
        description: "Brazalete oficial de Charly Garcia",
        sizes: ["Única"],
        colors: ["Negro", "Rojo"],
        stock: 40
    },
    {
        id: 17,
        name: "Remera Charly Garcia",
        price: 13500,
        artist: "Charly Garcia",
        artist_slug: "charly-garcia",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/533/443/products/charly-foto1-9824ad5fcabaf1153315125364462452-1024-1024.jpg",
        description: "Remera oficial de Charly Garcia",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco"],
        stock: 45
    },

    {
        id: 18,
        name: "Remera Spinetta",
        price: 11500,
        artist: "Luis Alberto Spinetta",
        artist_slug: "luis-alberto-spinetta",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/402/355/products/41-spinetta-a599e6bdec3f006d3117249656926202-480-0.jpg",
        description: "Remera oficial de Luis Alberto Spinetta",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 30
    },
    {
        id: 19,
        name: "Remera Spinetta",
        price: 12000,
        artist: "Luis Alberto Spinetta",
        artist_slug: "luis-alberto-spinetta",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/001/955/538/products/flaco-1c63e7c40cd2b2bda517337850620563-1024-1024.jpeg",
        description: "Remera pintada a mano de Luis Alberto Spinetta",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 50
    },
    {
        id: 20,
        name: "Remera Pappo",
        price: 12000,
        artist: "Pappo",
        artist_slug: "pappo",
        category: "clothing",
        image: "https://d22fxaf9t8d39k.cloudfront.net/8a3bab7955fbc0b2df8884d0fab26053d15435fe712d1b0d59b40bb0ea39989677142.jpg",
        description: "Remera oficial de Pappo",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 35
    },
    {
        id: 21,
        name: "Taza de Pappo",
        price: 9000,
        artist: "Pappo",
        artist_slug: "pappo",
        category: "accessories",
        image: "https://d22fxaf9t8d39k.cloudfront.net/9b41d7156f687097073ed26f5e19295bdc89edd60ee64faf0603cb7e0518c9b5193797.jpg",
        description: "Taza de Pappo: Conseguite un trabajo honesto",
        sizes: ["Única"],
        colors: ["Blanco"],
        stock: 30
    },
    {
        id: 22,
        name: "Remera Indio Solari",
        price: 11000,
        artist: "Indio Solari",
        artist_slug: "indio-solari",
        category: "clothing",
        image: "https://acdn-us.mitiendanube.com/stores/001/720/895/products/remera_indio_hombre1-c1d76d80c44acfbe6816350146411055-640-0.jpg",
        description: "Remera oficial de Indio Solari",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 45
    },
    {
        id: 23,
        name: "Chopp Indio Solari",
        price: 7000,
        artist: "Indio Solari",
        artist_slug: "indio-solari",
        category: "accessories",
        image: "https://acdn-us.mitiendanube.com/stores/614/494/products/indioolavarria1-832f90d67d7711245215240967828444-640-0.jpg",
        description: "Chopp oficial de Indio Solari",
        sizes: ["Única"],
        colors: ["Negro"],
        stock: 30
    },
    {
        id: 24,
        name: "Top corto Alma Nicki Nicole",
        price: 15000,
        artist: "Nicki Nicole",
        artist_slug: "nicki-nicole",
        category: "clothing",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZU5d3Kv4NLkzwfRmKZHn6D26q3HJ_brcETA&s",
        description: "Top corto oficial de Nicki Nicole Alma",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 60
    },
    {
        id: 25,
        name: "Buzo Nicki Nicole",
        price: 20000,
        artist: "Nicki Nicole",
        artist_slug: "nicki-nicole",
        category: "clothing",
        image: "https://dcdn-us.mitiendanube.com/stores/006/538/122/products/merch-nicki_0024_came3583-8bfc99ece7223a7bc317556259173729-480-0.png",
        description: "Buzo oficial de Nicki Nicole",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blanco", "Gris"],
        stock: 60
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

app.get("/duki-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/duki-catalog.html"));
});

app.get("/emilia-mernes-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/emilia-mernes-catalog.html"));
});

app.get("/tini-stoessel-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/tini-stoessel-catalog.html"));
});

app.get("/luck-ra-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "public/front/luck-ra-catalog.html"));
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