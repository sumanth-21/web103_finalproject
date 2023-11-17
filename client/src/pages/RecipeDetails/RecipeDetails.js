import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../utilities/Modal/Modal";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        navigate("/", {
          state: { alertMessage: "Creator Not Found :(" },
        });
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteButtonClick = () => {
    setIsModalOpen(true);
  };

  const onDeleteRecipeHandler = async () => {
    try {
      const options = {
        method: "DELETE",
      };

      await fetch(`/api/recipes/${id}`, options);
      navigate("/", {
        state: { alertMessage: `${recipe.title} Deleted Successfully!!` },
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const onCancelHandler = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div>
      {recipe ? (
        <div className="RecipeDetails">
          {isModalOpen && (
            <Modal
              name={recipe.title}
              onConfirm={onDeleteRecipeHandler}
              onCancel={onCancelHandler}
            />
          )}
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
          <input type="submit" value="Edit" onClick={handleEdit} />
          <button onClick={handleDeleteButtonClick}>Delete</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecipeDetails;
