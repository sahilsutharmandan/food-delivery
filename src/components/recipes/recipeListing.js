import Link from "next/link";
import RecipeImage from "@/components/RecipeImage";
import { recipeHref } from "@/lib/recipes";

export default function RecipeListing({ title, recipes, query }) {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {query && <p className="mt-3 break-words">Results for “{query}”</p>}
      {query && <p className="mt-2 text-sm opacity-80">Matching recipe names</p>}
      <p className="mt-3 opacity-80">{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}</p>
      {recipes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recipes.map((recipe) => (
            <article key={recipe.uri} className="min-w-0 overflow-hidden bg-white shadow rounded-3xl flex flex-col">
              <div className="relative">
                <RecipeImage src={recipe.image} alt={recipe.label} className="w-full aspect-[16/9] object-cover" loading="lazy" />
                {recipe.image.endsWith("pizza-fallback.jpg") && <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs">Illustrative pizza photo</span>}
              </div>
              <div className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-semibold">{recipe.label}</h2>
              <p className="mt-3 opacity-80">{recipe.mealType.join(", ")}</p>
              <p className="mt-2 text-sm">{recipe.ingredientLines.length} ingredients · {recipe.source}</p>
              <Link className="inline-block mt-4 font-semibold text-pink underline" href={recipeHref(recipe)}>View recipe<span className="sr-only">: {recipe.label}</span></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8"><p>No recipes found. Try another recipe name.</p><Link className="inline-block mt-4 text-pink underline" href="/recipe">Browse all recipes</Link></div>
      )}
    </section>
  );
}
