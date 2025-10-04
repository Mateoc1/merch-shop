const express = require("express");
const path = require("path");
const router = express.Router();

// Serve static HTML files from public/views directory
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/index.html"));
});

router.get("/artistas", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/artistas.html"));
});

router.get("/carrito", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/carrito.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/nuevolog.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/register.html"));
});

router.get("/ayuda", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/ayuda.html"));
});

router.get("/catalogo-artista", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/catalogo-artista.html"));
});

router.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/checkout.html"));
});

router.get("/order-success", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/order-success.html"));
});

module.exports = router;