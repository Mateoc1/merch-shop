require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

const viewRoutes = require("./routes/views");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/authRoute");

app.use("/" , viewRoutes);
app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("http://localhost:${port}"))
