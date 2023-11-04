import { pool } from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);
const recipeFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/data.json")
);
const data = JSON.parse(recipeFile);

const createProfessionsTable = async () => {
  const createProfessionsTableQuery = `
        DROP TABLE IF EXISTS professions CASCADE;
        CREATE TABLE IF NOT EXISTS professions (
            profession_id SERIAL PRIMARY KEY,
            profession_name VARCHAR(50) UNIQUE NOT NULL
        );    
        `;
  try {
    const res = await pool.query(createProfessionsTableQuery);
    console.log("🎉 Professions table created successfully");
  } catch (err) {
    console.error("⚠️ error creating Professions table", err);
  }
};

const createRecipesTable = async () => {
  const createRecipesTableQuery = `
    DROP TABLE IF EXISTS recipes CASCADE;
    CREATE TABLE IF NOT EXISTS recipes (
        recipe_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        ingredients TEXT[] NOT NULL,
        instructions TEXT NOT NULL,
        profession_id INTEGER REFERENCES professions(profession_id) NOT NULL
    );
    `;
  try {
    const res = await pool.query(createRecipesTableQuery);
    console.log("🎉 Recipes table created successfully");
  } catch (err) {
    console.error("⚠️ error creating Recipes table", err);
  }
};

const createCategoriesTable = async () => {
  const createCategoriesTableQuery = `
        DROP TABLE IF EXISTS categories CASCADE;
        CREATE TABLE IF NOT EXISTS categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(50) UNIQUE NOT NULL
        );
      `;
  try {
    const res = await pool.query(createCategoriesTableQuery);
    console.log("🎉 Categories table created successfully");
  } catch (err) {
    console.error("⚠️ error creating Categories table", err);
  }
};

const createRecipeCategoryTable = async () => {
  const createRecipeCategoryTableQuery = `
        DROP TABLE IF EXISTS recipe_category CASCADE;
        CREATE TABLE IF NOT EXISTS recipe_category (
            recipe_id INTEGER REFERENCES recipes(recipe_id) NOT NULL,
            category_id INTEGER REFERENCES categories(category_id) NOT NULL,
            PRIMARY KEY (recipe_id, category_id)
        );    
      `;
  try {
    const res = await pool.query(createRecipeCategoryTableQuery);
    console.log("🎉 RecipeCategory table created successfully");
  } catch (err) {
    console.error("⚠️ error creating RecipeCategory table", err);
  }
};

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

// Function to seed a specific table
const seedTable = async (tableName, tableData, columns) => {
  const createTable = `create${tableName.capitalize()}Table`;
  await eval(createTable + "()");
  const formattedTableName = tableName
    .replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
      return "_" + y.toLowerCase();
    })
    .replace(/^_/, "");

  tableData.forEach(async (item) => {
    const insertQuery = {
      text: `INSERT INTO ${formattedTableName} (${columns.join(
        ", "
      )}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(", ")})`,
    };

    const values = columns.map((col) => item[col]);

    try {
      await pool.query(insertQuery, values);
      console.log(`✅ ${item.title} added successfully to ${tableName}`);
    } catch (err) {
      console.error(`⚠️ Error inserting data into ${tableName}`, err);
    }
  });
};

seedTable("professions", data.professions, ["profession_name"]);
seedTable("recipes", data.recipes, [
  "title",
  "ingredients",
  "instructions",
  "profession_id",
]);
seedTable("categories", data.categories, ["category_name"]);
seedTable("recipeCategory", data.recipeCategory, ["recipe_id", "category_id"]);
