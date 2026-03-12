const mongoose = require("mongoose");

//definimos el esquema de la receta
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    preptime: {
      type: Number,
      required: true,
      min: 1,
      max: 24 * 60, // maximo 24 horas en minutos
    },
    ingredients: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["fácil", "medio", "difícil"],
      default: "fácil",
    },
    // referencia al usuario que creó la receta
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recipe", recipeSchema);
