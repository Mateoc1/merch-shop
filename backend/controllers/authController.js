const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/users.json");

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        // Create directory if it doesn't exist
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return [];
    }
    
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
}

function saveUsers(users) {
    try {
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error saving users file:', err);
    }
}

const register = (req, res) => {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
        return res.status(400).send("Todos los campos son requeridos");
    }
    
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).send("Ese usuario ya existe");
    }

    users.push({ nombre, email, password });
    saveUsers(users);

    res.status(201).send("Usuario registrado con éxito");
};

const login = (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send("Email y contraseña son requeridos");
    }
    
    const users = readUsers();

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).send("Credenciales incorrectas");
    }

    req.session.user = user;
    console.log(" Usuario guardado en sesión:", req.session.user);

    res.status(200).send("Login exitoso");
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error al cerrar sesión");
        }
        res.status(200).send("Logout exitoso");
    });
};

module.exports = { register, login, logout };