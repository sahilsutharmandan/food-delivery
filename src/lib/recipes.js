import foods from "../../public/foods.json";

export const recipes = foods.hits.map(({ recipe }) => recipe);
// Match the existing home-page collections; the dataset has no ranking/date fields.
export const sections = {
  trending: { title: "Trending Recipes", recipes: recipes.slice(0, 8) },
  newest: { title: "Newest Recipes", recipes: recipes.slice(16, 24) },
  popular: { title: "Popular Recipes", recipes: recipes.slice(30, 45) },
};

export function getRecipeId(recipe) {
  if (!recipe || !recipe.uri) return "";
  const parts = recipe.uri.split("#recipe_");
  return parts.length > 1 ? parts[1] : encodeURIComponent(recipe.uri);
}

export function getRecipeById(id) {
  if (!id) return null;
  const decoded = decodeURIComponent(id);
  return (
    recipes.find(
      (recipe) =>
        recipe.uri.endsWith(`#recipe_${decoded}`) ||
        recipe.uri === decoded ||
        getRecipeId(recipe) === decoded
    ) || null
  );
}

export function getRelatedRecipes(currentRecipe, limit = 3) {
  if (!currentRecipe) return recipes.slice(0, limit);
  const currentId = getRecipeId(currentRecipe);
  return recipes
    .filter((r) => getRecipeId(r) !== currentId)
    .slice(0, limit);
}

export function searchRecipes(query) {
  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return recipes.filter((recipe) => {
    const text = recipe.label.toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

