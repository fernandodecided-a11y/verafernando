import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

const router = Router();
const USERS_FILE = "./data/users.json";

// Leer usuarios
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}
// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registro
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Usuario ya existe" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), email, password: hashed, role: role || "user" };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ mensaje: "Usuario creado" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Credenciales inválidas" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token });
});

export default router;
