import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

const ReadRecipes = (props) => {
  const [recipes, setRecipes] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setRecipes(props.data);

    // Fetch professions and categories for filtering
    fetch("/api/professions")
      .then((response) => response.json())
      .then((data) => setProfessions(data));

    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, [props]);

  const handleProfessionChange = (event) => {
    setSelectedProfession(parseInt(event.target.value));
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const professionMatch =
      selectedProfession === 0 || recipe.profession_id === selectedProfession;

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.every((category) =>
        recipe.category_ids.includes(parseInt(category))
      );

    return professionMatch && categoryMatch;
  });

  return (
    <div className="ReadRecipes">
      <div className="filters">
        <label>
          Filter by Profession:
          <select value={selectedProfession} onChange={handleProfessionChange}>
            <option value={0}>All Professions</option>
            {professions.map((profession) => (
              <option
                key={profession.profession_id}
                value={profession.profession_id}
              >
                {profession.profession_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Category:
          {categories.map((category) => (
            <label key={category.category_id}>
              <input
                type="checkbox"
                name={category.category_id}
                checked={selectedCategories.includes(category.category_id)}
                onChange={handleCategoryChange}
              />
              {category.category_name}
            </label>
          ))}
        </label>
      </div>

      {filteredRecipes && filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.recipe_id}
            id={recipe.recipe_id}
            title={recipe.title}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
            profession_id={recipe.profession_id}
            category_ids={recipe.category_ids}
          />
        ))
      ) : (
        <h3 className="noResults">{"No Recipes Found 😞"}</h3>
      )}
    </div>
  );
};

export default ReadRecipes;
