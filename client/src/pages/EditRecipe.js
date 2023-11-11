import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import "./EditRecipe.css";

const EditRecipe = ({ data }) => {
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    profession_id: 0,
    categories: [],
  });

  const [professions, setProfessions] = useState([]);

  useEffect(() => {
    console.log(data);
    const result = data.filter(
      (item) => item.recipe_id === parseInt(recipe_id)
    )[0];
    setRecipe({
      title: result.title,
      ingredients: result.ingredients,
      instructions: result.instructions,
      profession_id: parseInt(result.profession_id),
      categories: result.category_ids,
    });
  }, [data, recipe_id]);

  useEffect(() => {
    fetch("/api/professions")
      .then((response) => response.json())
      .then((data) => setProfessions(data));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setRecipe((prev) => {
      if (checked) {
        return {
          ...prev,
          categories: [...prev.categories, name],
        };
      } else {
        return {
          ...prev,
          categories: prev.categories.filter((category) => category !== name),
        };
      }
    });
  };

  const updateRecipe = async (event) => {
    event.preventDefault();

    try {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      };

      await fetch(`/api/recipes/${recipe_id}`, options);
      window.location.href = "/"; // Redirect to the home page after updating the recipe
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const deleteRecipe = async (event) => {
    event.preventDefault();

    try {
      const options = {
        method: "DELETE",
      };

      await fetch(`/api/recipes/${recipe_id}`, options);
      window.location.href = "/"; // Redirect to the home page after deleting the recipe
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div>
      <form>
        <label>Title</label> <br />
        <input
          type="text"
          id="title"
          name="title"
          value={recipe.title}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Ingredients</label>
        <br />
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
        <br />
        <br />
        <label>Instructions</label>
        <br />
        <textarea
          rows="5"
          cols="50"
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        ></textarea>
        <br />
        <br />
        <label>Profession</label>
        <br />
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
        <br />
        <br />
        <label>Categories</label>
        <br />
        {recipe.categories &&
          recipe.categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                name={category}
                checked={recipe.categories.includes(category)}
                onChange={handleCheckboxChange}
              />
              {category}
            </label>
          ))}
        <br />
        <br />
        <input type="submit" value="Update" onClick={updateRecipe} />
        <button className="deleteButton" onClick={deleteRecipe}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
