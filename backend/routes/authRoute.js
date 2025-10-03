const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();
const USERS_FILE = path.join(__dirname, "../data/users.json");

                                                                      // sesiones 
router.use(
  session({
    secret: "clave-secreta",
    resave: false,
    saveUninitialized: true,
  })
);

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  
  try {
    const data = fs.readFileSync(USERS_FILE);
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];  
  } catch (err) {
    return []; // si hay error al leer se devuelve un array vacío
  }
}


function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- Registro ---
router.post("/register",register );

// --- Login ---
router.post("/login", login );

// --- Logout ---
router.get("/logout", logout );

// usuario actual
router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "No hay usuario logueado" });
  }
});


module.exports = router;
