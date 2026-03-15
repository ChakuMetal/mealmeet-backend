// Middleware centralizado de gestión de errores

const errorMiddleware = (err, req, res, next) => {
  console.error("🔴 Error", err.message);

  // Error de servidor
  if (!err.status) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }

  // Error de recurso no encontrado (así no damos pistas)
  if (err.status === 404) {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }

  // Por defecto
  return res.status(err.status).json({ error: err.message });
};

module.exports = errorMiddleware;
