import React, { useState, useEffect } from "react";
import "./CreateRecipe.css";

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    profession_id: 0,
    categories: [],
  });

  const [professions, setProfessions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const professionsResponse = await fetch("/api/professions");
        const professionsData = await professionsResponse.json();
        setProfessions(professionsData);

        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setAllCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  const createRecipe = async (event) => {
    event.preventDefault();

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      };

      await fetch("/api/recipes", options);
      window.location.href = "/"; // Redirect to the home page after creating the recipe
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <div>
      <center>
        <h3>Create New Recipe</h3>
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
          placeholder="Enter ingredients separated by commas"
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

        {allCategories.map((category) => (
          <label key={category.category_id}>
            <input
              type="checkbox"
              name={category.category_name}
              checked={recipe.categories.includes(category.category_name)}
              onChange={handleCheckboxChange}
            />
            {category.category_name}
          </label>
        ))}

        <input type="submit" value="Submit" onClick={createRecipe} />
      </form>
    </div>
  );
};

export default CreateRecipe;
