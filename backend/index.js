require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "merch-shop-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
const viewRoutes = require("./routes/views");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/authRoute");

app.use("/", viewRoutes);
app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, "../public")}`);
});