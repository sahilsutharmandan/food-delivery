import foods from "../../public/foods.json";

export const recipes = foods.hits.map(({ recipe }) => recipe);
// Match the existing home-page collections; the dataset has no ranking/date fields.
export const sections = {
  trending: { title: "Trending Recipes", recipes: recipes.slice(0, 8) },
  newest: { title: "Newest Recipes", recipes: recipes.slice(16, 24) },
  popular: { title: "Popular Recipes", recipes: recipes.slice(30, 45) },
};

export function searchRecipes(query) {
  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return recipes.filter((recipe) => {
    const text = [recipe.label, ...recipe.ingredientLines, ...recipe.cuisineType, ...recipe.mealType, ...recipe.dishType].join(" ").toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
