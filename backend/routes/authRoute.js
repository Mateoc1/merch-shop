const express = require("express");
const fs = require("fs");
const path = require("path");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);


router.get("/me", (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: "No hay usuario logueado" });
    }
});

module.exports = router;