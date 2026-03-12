//cargar variables de entorno
require("dotenv").config();

// importar las dependencias
const express = require("express");
const mongoose = require("mongoose");

//Crear la aplicación Express:
const app = express();

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
const recipeRoutes = require("./routes/recipeRoutes");

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

//Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando en Mongo DB 🤙");
});

//Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`),
);
