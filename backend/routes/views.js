const express = require("express");
const path = require("path");
const router = express.Router();

// API endpoint to get environment variables
router.get("/api/config", (req, res) => {
    res.json({
        SUPABASE_URL: process.env.VITE_SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
    });
});

// Serve static HTML files from public/views directory
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

router.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/checkout.html"));
});

router.get("/order-success", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/order-success.html"));
});

router.get("/stripe-success", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/stripe-success.html"));
});

router.get("/duki-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/duki-catalog.html"));
});

router.get("/emilia-mernes-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/emilia-mernes-catalog.html"));
});

router.get("/tini-stoessel-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/tini-stoessel-catalog.html"));
});

router.get("/luck-ra-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/luck-ra-catalog.html"));
});

router.get("/abel-pintos-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/abel-pintos-catalog.html"));
});

router.get("/milo-j-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/milo-j-catalog.html"));
});

router.get("/bizarrap-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/bizarrap-catalog.html"));
});

router.get("/charly-garcia-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/charly-garcia-catalog.html"));
});

router.get("/luis-alberto-spinetta-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/luis-alberto-spinetta-catalog.html"));
});

router.get("/pappo-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/pappo-catalog.html"));
});

router.get("/indio-solari-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/indio-solari-catalog.html"));
});

router.get("/nicki-nicole-catalog", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/front/nicki-nicole-catalog.html"));
});

module.exports = router;