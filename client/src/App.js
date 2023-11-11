import "./App.css";
import React, { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import ReadRecipes from "./pages/ReadRecipes";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import { Link } from "react-router-dom";

const App = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/recipes");
      const data = await response.json();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <ReadRecipes data={recipes} />,
    },
    {
      path: "/recipe/new",
      element: <CreateRecipe />,
    },
    {
      path: "/recipes/:id",
      element: <RecipeDetails />,
    },
    {
      path: "/edit/:recipe_id",
      element: <EditRecipe data={recipes} />,
    },
  ]);

  return (
    <div className="App">
      <div className="header">
        <h1>Recipe Box</h1>
        <Link to="/">
          <button className="headerBtn">Explore Recipe</button>
        </Link>
        <Link to="/recipe/new">
          <button className="headerBtn"> + Add Recipe </button>
        </Link>
      </div>
      {element}
    </div>
  );
};

export default App;
