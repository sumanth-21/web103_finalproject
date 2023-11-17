import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../utilities/Modal/Modal";
import "./EditRecipe.css";

const EditRecipe = ({ data }) => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    profession_id: 0,
    categories: [],
  });

  const [professions, setProfessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/professions")
      .then((response) => response.json())
      .then((data) => setProfessions(data));
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const result = data.filter(
        (item) => item.recipe_id === parseInt(recipe_id)
      )[0];

      // Check if a recipe with the given recipe_id exists
      if (result) {
        fetch("/api/categories")
          .then((response) => response.json())
          .then((categoriesData) => {
            const categoryIds = result.category_ids || [];

            setRecipe({
              title: result.title,
              ingredients: result.ingredients,
              instructions: result.instructions,
              profession_id: result.profession_id,
              categories: categoriesData.map((category) => ({
                category_id: category.category_id,
                category_name: category.category_name,
                checked: categoryIds.includes(category.category_id),
              })),
            });
          });
      }
    }
  }, [data, recipe_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setRecipe((prev) => ({
      ...prev,
      categories: prev.categories.map((category) => ({
        ...category,
        checked: category.category_name === name ? checked : category.checked,
      })),
    }));
  };

  const updateRecipe = async (event) => {
    event.preventDefault();

    try {
      // Extracting only the category IDs from the updated categories array
      const updatedCategoryIds = recipe.categories
        .filter((category) => category.checked)
        .map((category) => category.category_id);

      const updatedRecipe = {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        profession_id: recipe.profession_id,
        categories: updatedCategoryIds, // Send only the updated category IDs
      };

      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipe),
      };

      await fetch(`/api/recipes/${recipe_id}`, options);
      navigate("/", {
        state: {
          alertMessage: `${updatedRecipe.title} Updated Successfully!!`,
        },
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const onDeleteRecipeHandler = async (event) => {
    event.preventDefault();

    try {
      const options = {
        method: "DELETE",
      };

      await fetch(`/api/recipes/${recipe_id}`, options);
      navigate("/", {
        state: { alertMessage: `${recipe.title} Deleted Successfully!!` },
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleDeleteButtonClick = () => {
    setIsModalOpen(true);
  };

  const onCancelHandler = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="RecipeForm">
      {isModalOpen && (
        <Modal
          name={recipe.title}
          onConfirm={onDeleteRecipeHandler}
          onCancel={onCancelHandler}
        />
      )}
      <center>
        <h3>Edit Recipe</h3>
      </center>
      <form>
        <label>Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={recipe.title}
          onChange={handleChange}
        />

        <label>Ingredients</label>

        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={recipe.ingredients.join(", ")}
          onChange={(event) => {
            const ingredients = event.target.value.split(", ");
            setRecipe((prev) => ({
              ...prev,
              ingredients,
            }));
          }}
        />

        <label>Instructions</label>

        <textarea
          rows="5"
          cols="50"
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        ></textarea>

        <label>Profession</label>

        <select
          id="profession_id"
          name="profession_id"
          value={recipe.profession_id}
          onChange={handleChange}
        >
          <option value={0}>Select a Profession</option>
          {professions.map((profession) => (
            <option
              key={profession.profession_id}
              value={profession.profession_id}
            >
              {profession.profession_name}
            </option>
          ))}
        </select>

        <label>Categories</label>

        {recipe.categories &&
          recipe.categories.map((category) => (
            <label key={category.category_id}>
              <input
                type="checkbox"
                name={category.category_name}
                checked={category.checked}
                onChange={handleCheckboxChange}
              />
              {category.category_name}
            </label>
          ))}

        <input type="submit" value="Update" onClick={updateRecipe} />
        <button
          type="button"
          className="deleteButton"
          onClick={handleDeleteButtonClick}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
