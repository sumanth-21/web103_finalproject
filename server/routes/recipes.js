import express from "express";

import RecipesController from "../controllers/recipes.js";

const router = express.Router();

router.get("/", RecipesController.getRecipes);
router.get("/:recipe_id", RecipesController.getRecipe);
router.post("/", RecipesController.createRecipe);
router.delete("/:recipe_id", RecipesController.deleteRecipe);
router.patch("/:recipe_id", RecipesController.updateRecipe);

export default router;
