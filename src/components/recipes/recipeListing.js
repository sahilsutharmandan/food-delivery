import Link from "next/link";
import RecipeImage from "@/components/RecipeImage";
import { getRecipeId } from "@/lib/recipes";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function RecipeListing({ title, recipes = [], query }) {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-200/70">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-dark">{title}</h1>
          {query ? (
            <p className="mt-2 text-base text-gray-600 break-words">
              Results for <span className="font-semibold text-pink">“{query}”</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Explore our curated selection of delicious and easy-to-make recipes.
            </p>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm self-start md:self-auto border border-neutral-100">
          {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      {recipes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
          {recipes.map((recipe) => {
            const recipeId = getRecipeId(recipe);
            return (
              <article
                key={recipe.uri}
                className="group flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden border border-neutral-100/90"
              >
                <Link
                  href={`/recipe/${recipeId}`}
                  className="relative block w-full h-52 sm:h-56 overflow-hidden bg-neutral-100 focus:outline-none"
                  aria-label={`View recipe for ${recipe.label}`}
                >
                  <RecipeImage
                    src={recipe.image}
                    alt={recipe.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  {recipe.mealType?.[0] && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/95 text-dark shadow-sm backdrop-blur-sm capitalize">
                      {recipe.mealType[0]}
                    </span>
                  )}
                  {recipe.cuisineType?.[0] && (
                    <span className="absolute top-3.5 right-3.5 px-3 py-1 text-xs font-semibold rounded-full bg-pink text-white shadow-sm backdrop-blur-sm capitalize">
                      {recipe.cuisineType[0]}
                    </span>
                  )}
                </Link>

                <div className="flex flex-col flex-1 p-5">
                  <Link
                    href={`/recipe/${recipeId}`}
                    className="focus:outline-none group-hover:text-pink transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-dark line-clamp-1">
                      {recipe.label}
                    </h2>
                  </Link>

                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-dark/70">
                      <RestaurantMenuIcon className="text-sm text-pink" />
                      {recipe.ingredientLines.length} ingredients
                    </span>
                    <span>•</span>
                    <span className="truncate">{recipe.source}</span>
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-neutral-100">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                        Calories
                      </span>
                      <span className="text-sm font-bold text-dark">
                        {Math.round(recipe.calories)} kcal
                      </span>
                    </div>

                    <Link
                      href={`/recipe/${recipeId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-pink hover:opacity-90 rounded-2xl shadow-sm transition-all duration-200 active:scale-95"
                    >
                      <span>View recipe</span>
                      <ArrowForwardIcon className="text-base" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 p-12 bg-white rounded-3xl text-center shadow-sm max-w-lg mx-auto border border-neutral-100">
          <div className="size-16 mx-auto mb-4 rounded-full bg-pink/10 flex items-center justify-center text-pink">
            <RestaurantMenuIcon className="text-3xl" />
          </div>
          <h3 className="text-2xl font-semibold text-dark">No recipes found</h3>
          <p className="mt-2 text-gray-500 text-sm">
            We could not find any recipes matching your search. Try searching by another recipe title.
          </p>
          <Link
            className="inline-block mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-pink rounded-2xl hover:opacity-90 transition-opacity shadow-sm"
            href="/recipe"
          >
            Browse all recipes
          </Link>
        </div>
      )}
    </section>
  );
}
