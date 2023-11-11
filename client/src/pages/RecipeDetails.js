import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const options = {
        method: "DELETE",
      };

      await fetch(`/api/recipes/${id}`, options);
      navigate("/"); // Redirect to the home page after deleting the recipe
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div>
      {recipe ? (
        <div>
          <h2>{recipe.title}</h2>
          <p>
            <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
          </p>
          <p>
            <strong>Instructions:</strong> {recipe.instructions}
          </p>
          <p>
            <strong>Profession:</strong> {recipe.profession_name}
          </p>
          <p>
            <strong>Categories:</strong>{" "}
            {recipe.category_names.map((category_name, index) => (
              <span key={category_name}>
                {category_name}
                {index < recipe.category_names.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecipeDetails;
