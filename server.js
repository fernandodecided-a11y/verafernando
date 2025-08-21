import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import { authRequired } from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "API del curso funcionando ✅" });
});

// Rutas públicas
app.use("/auth", authRoutes);

// Rutas privadas (protección con JWT)
app.use("/api", authRequired, productRoutes);

// Iniciar servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor en http://localhost:${process.env.PORT}`);
});
