import express from "express";
import cors from "cors";
import recipeRoutes from "./routes/recipes.js";
import professionsRoutes from "./routes/professions.js";
import categoriesRoutes from "./routes/categories.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">RecipeBook API</h1>'
    );
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/professions", professionsRoutes);
app.use("/api/categories", categoriesRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
