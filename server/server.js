import express from "express";
import cors from "cors";
import recipeRoutes from "./routes/recipes.js";
import professionsRoutes from "./routes/professions.js";
import categoriesRoutes from "./routes/categories.js";

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "recipe-book-client.up.railway.app"
    : "http://localhost:3000";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.redirect(CLIENT_URL);
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/professions", professionsRoutes);
app.use("/api/categories", categoriesRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
