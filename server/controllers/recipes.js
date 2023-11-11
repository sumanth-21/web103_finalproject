import { pool } from "../config/database.js";

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, profession_id, categories } =
      req.body;

    const results = await pool.query(
      `INSERT INTO recipes (title, ingredients, instructions, profession_id)
        VALUES($1, $2, $3, $4) 
        RETURNING recipe_id`,
      [title, ingredients, instructions, profession_id]
    );

    const recipeId = results.rows[0].recipe_id;

    // Insert into recipe_category for each category
    for (const category_id of categories) {
      await pool.query(
        `INSERT INTO recipe_category (recipe_id, category_id)
          VALUES ($1, $2)`,
        [recipeId, category_id]
      );
    }

    res.status(201).json({ recipe_id: recipeId });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getRecipes = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT recipes.*, ARRAY_AGG(recipe_category.category_id) AS category_ids
      FROM recipes
      LEFT JOIN recipe_category ON recipes.recipe_id = recipe_category.recipe_id
      GROUP BY recipes.recipe_id
      ORDER BY recipes.recipe_id ASC`
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe_id = parseInt(req.params.recipe_id);
    const results = await pool.query(
      `SELECT
      recipes.recipe_id,
      recipes.title,
      recipes.ingredients,
      recipes.instructions,
      professions.profession_name,
      ARRAY_AGG(categories.category_name) AS category_names
    FROM
      recipes
    JOIN
      professions ON recipes.profession_id = professions.profession_id
    LEFT JOIN
      recipe_category ON recipes.recipe_id = recipe_category.recipe_id
    LEFT JOIN
      categories ON recipe_category.category_id = categories.category_id
    WHERE
      recipes.recipe_id = $1
    GROUP BY
      recipes.recipe_id, recipes.title, recipes.ingredients, recipes.instructions, professions.profession_name;
    `,
      [recipe_id]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe_id = parseInt(req.params.recipe_id);
    const { title, ingredients, instructions, profession_id, categories } =
      req.body;

    // Update the recipe
    const results = await pool.query(
      `UPDATE recipes
        SET title = $1, ingredients = $2, instructions = $3, profession_id = $4
        WHERE recipe_id = $5`,
      [title, ingredients, instructions, profession_id, recipe_id]
    );

    // Delete existing entries in recipe_category
    await pool.query("DELETE FROM recipe_category WHERE recipe_id = $1", [
      recipe_id,
    ]);

    // Insert into recipe_category for each category
    for (const category_id of categories) {
      await pool.query(
        `INSERT INTO recipe_category (recipe_id, category_id)
          VALUES ($1, $2)`,
        [recipe_id, category_id]
      );
    }

    res.status(200).json({ recipe_id });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe_id = parseInt(req.params.recipe_id);
    // Assuming there's a foreign key constraint with recipe_category table
    const recipeCategoryTableDeletion = await pool.query(
      `DELETE FROM recipe_category
      WHERE recipe_id = $1`,
      [recipe_id]
    );

    const results = await pool.query(
      "DELETE FROM recipes WHERE recipe_id = $1",
      [recipe_id]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
