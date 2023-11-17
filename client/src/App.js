import "./App.css";
import React, { useState, useEffect } from "react";
import { useRoutes, useLocation, Link } from "react-router-dom";
import ReadRecipes from "./pages/ReadRecipes/ReadRecipes";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import EditRecipe from "./pages/EditRecipe/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails/RecipeDetails";
import NotFound from "./components/NotFound/NotFound";
import Loader from "./utilities/Loader/Loader";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch recipes. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setRecipes(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [location.pathname]);

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
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  if (isLoading) {
    return <Loader />;
  }

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
