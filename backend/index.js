require("dotenv").config();
const express = require("express");
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Importar rutas
const viewRoutes = require("./routes/views");
const productRoutes = require("./routes/products");

// Usar rutas
app.use("/", viewRoutes);
app.use("/api/products", productRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
