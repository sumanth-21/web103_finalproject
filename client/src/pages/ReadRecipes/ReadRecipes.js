import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Alert from "../../utilities/Alert/Alert";
import Loader from "../../utilities/Loader/Loader";
import "./ReadRecipes.css";

const ReadRecipes = (props) => {
  const [recipes, setRecipes] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAlert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const alertMessage = location.state?.alertMessage || "";
  window.history.replaceState({}, document.title);

  useEffect(() => {
    if (alertMessage && isAlert === false) {
      setAlert(true);
      var alertTimeout = setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
    return () => {
      clearTimeout(alertTimeout);
    };
  }, [alertMessage, isAlert]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch recipes
        setRecipes(props.data);

        // Fetch professions and categories for filtering
        const professionsResponse = await fetch("/api/professions");
        const professionsData = await professionsResponse.json();
        setProfessions(professionsData);

        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="ReadRecipes">
      {isAlert && <Alert message={alertMessage} />}
      <div className="ProfFilter">
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
      </div>
      <div className="RecipeWrapper">
        <div className="Filters">
          <h3>Filter by Category:</h3>
          <div className="FiltersList">
            {categories.map((category) => (
              <div className="container">
                <label key={category.category_id}>
                  {category.category_name}
                  <input
                    type="checkbox"
                    name={category.category_id}
                    onChange={handleCategoryChange}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="RecipeList">
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
      </div>
    </div>
  );
};

export default ReadRecipes;
