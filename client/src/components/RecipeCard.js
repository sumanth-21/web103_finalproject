import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({ id, title, ingredients, instructions }) => {
  return (
    <div className="RecipeCard">
      <h2>{title}</h2>
      <p>
        <strong>Ingredients:</strong> {ingredients.join(", ")}
      </p>
      <p>
        <strong>Instructions:</strong> {instructions}
      </p>
      <Link to={`/recipes/${id}`}>View Details</Link>
    </div>
  );
};

export default RecipeCard;
