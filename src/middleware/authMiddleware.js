const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" "); // "Bearer token"

    // si no hay Bearer o no hay token
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // si hay token ---> verificamos el token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verifyToken.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
    req.user = user;

    next(); // pasamos a las rutas
  } catch (err) {
    return res.status(401).json({ error: "Token no válido o expirado" });
  }
};

module.exports = auth;
