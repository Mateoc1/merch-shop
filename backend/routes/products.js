const express = require("express");
const router = express.Router();
const { getProducts, getProductById } = require("../controllers/productsController");

// /api/products
router.get("/", getProducts);

// /api/products/:id
router.get("/:id", getProductById);

module.exports = router;

