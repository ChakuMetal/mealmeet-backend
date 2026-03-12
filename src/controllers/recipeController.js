const Recipe = require("../models/Recipe");

// CRUD

// Creación de la receta (CREATE) -- POST --
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      preptime,
      ingredients,
      instructions,
      image,
      category,
      level,
    } = req.body;
    const recipe = await Recipe.create({
      title,
      preptime,
      ingredients,
      instructions,
      image,
      category,
      level,
      user: req.user._id,
    });

    return res.status(201).json(recipe);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error al crear la receta", error: err.message });
  }
};

// Obtener todas las recetas -- GET all --
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("user", "name email");
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error al obtener las recetas", error: err.message });
  }
};

// Obtener una sola receta -- GET one -- /api/recipes/:id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error obteniendo receta", error: error.message });
  }
};

// Actualizar receta (UPDATE) -- PUT --
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }
    // Ownership check
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error al actualizar la receta", error: err.message });
  }
};
// Eliminar receta (DELETE) -- DELETE -- (solo el dueño de la receta)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    // Ownership check
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Receta eliminada" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error eliminando receta", error: error.message });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
