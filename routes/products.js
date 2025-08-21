import { Router } from "express";
import fs from "fs";
import { requireRole } from "../middleware/roles.js";

const router = Router();
const PRODUCTS_FILE = "./data/products.json";

// Leer productos
function getProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
}
// Guardar productos
function saveProducts(data) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
}

// Listar
router.get("/products", (req, res) => {
  res.json(getProducts());
});

// Crear
router.post("/products", (req, res) => {
  const products = getProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// Actualizar
router.patch("/products/:id", (req, res) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: "No encontrado" });
  products[idx] = { ...products[idx], ...req.body };
  saveProducts(products);
  res.json(products[idx]);
});

// Eliminar (solo admin)
router.delete("/products/:id", requireRole("admin"), (req, res) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: "No encontrado" });
  const eliminado = products.splice(idx, 1);
  saveProducts(products);
  res.json({ mensaje: "Eliminado", eliminado });
});

export default router;
