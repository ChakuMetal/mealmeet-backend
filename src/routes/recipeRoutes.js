const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const router = express.Router();

// Rutas CRUD
router.get("/", getAllRecipes); // GET todas (pública)
router.post("/", auth, createRecipe); // POST crear (protegida)
router.get("/:id", getRecipeById); // GET por ID (pública)
router.put("/:id", auth, updateRecipe); // PUT actualizar (protegida)
router.delete("/:id", auth, deleteRecipe); // DELETE (protegida)

module.exports = router;
