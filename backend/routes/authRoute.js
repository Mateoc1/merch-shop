const express = require("express");
const fs = require("fs");
const path = require("path");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();

// POST /auth/register - Register new user
router.post("/register", register);

// POST /auth/login - Login user
router.post("/login", login);

// GET /auth/logout - Logout user
router.get("/logout", logout);

// GET /auth/me - Get current user
router.get("/me", (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: "No hay usuario logueado" });
    }
});

module.exports = router;