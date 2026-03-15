//cargar variables de entorno
require("dotenv").config();

// importar las dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");

//Crear la aplicación Express:
const app = express();

// Configuración de CORS
app.use(cors());

// Middleware
app.use(express.json());

// conexion de mongo db con mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a base de datos 😁"))
  .catch((err) =>
    console.error("Error al conectar a la base de datos:😒", err),
  );

// Importar rutas
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const recipeRoutes = require("./routes/recipeRoutes");
app.use("/api/recipes", recipeRoutes);

//Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando en Mongo DB 🤙");
});

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada 💀" }));

// Middleware de errores
app.use(errorMiddleware);

//Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`),
);
