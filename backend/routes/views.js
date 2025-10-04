const express = require("express");
const path = require("path");
const router = express.Router();

// Rutas para las páginas estáticas
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/index.html"));
});

router.get("/artistas", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/artistas.html"));
});

router.get("/carrito", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/carrito.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/nuevolog.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/register.html"));
});

router.get("/ayuda", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/ayuda.html"));
});

router.get("/catalogo-artista", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/catalogo-artista.html"));
});

module.exports = router;
