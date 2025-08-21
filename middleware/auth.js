import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [bearer, token] = auth.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token requerido" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
