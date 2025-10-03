const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/users.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}


const register = (req, res) => {                    //register
  const { nombre, email, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).send("Ese usuario ya existe");
  }

  users.push({ nombre, email, password });
  saveUsers(users);

  res.status(201).send("Usuario registrado con éxito");
};


const login = (req, res) => {                       //login
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).send("Credenciales incorrectas");
  }

  req.session.user = user;
  res.status(200).send("Login exitoso");
};


const logout = (req, res) => {                      //logout
  req.session.destroy(() => {
    res.status(200).send("Logout exitoso");
  });
};

module.exports = { register, login, logout };
