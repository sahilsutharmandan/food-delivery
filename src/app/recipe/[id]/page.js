import Link from "next/link";
import { notFound } from "next/navigation";
import RecipeImage from "@/components/RecipeImage";
import { recipes, recipeId } from "@/lib/recipes";

export default async function RecipePage({ params }) {
  const { id } = await params;
  const recipe = recipes.find((item) => recipeId(item) === id);
  if (!recipe) notFound();
  const servings = recipe.yield;
  return (
    <article className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/recipe" className="inline-block mb-6 text-pink font-semibold">← All recipes</Link>
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm grid md:grid-cols-2">
        <div className="relative">
          <RecipeImage src={recipe.image} alt={recipe.label} className="w-full h-full min-h-64 max-h-[520px] object-cover" />
          {recipe.image.endsWith("pizza-fallback.jpg") && <p className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs">Illustrative pizza photo</p>}
        </div>
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <p className="text-pink uppercase tracking-widest text-xs font-semibold mb-4">{recipe.cuisineType.join(" · ")} · {recipe.mealType.join(" · ")}</p>
          <h1 className="text-3xl md:text-4xl leading-snug font-bold">{recipe.label}</h1>
          <p className="mt-4 opacity-80">Recipe from {recipe.source}</p>
          <dl className="grid grid-cols-3 gap-3 border-y my-6 py-5">
            <div><dt className="text-xs opacity-70">Servings</dt><dd className="text-xl font-semibold mt-1">{servings || "—"}</dd></div>
            <div><dt className="text-xs opacity-70">Ingredients</dt><dd className="text-xl font-semibold mt-1">{recipe.ingredientLines.length}</dd></div>
            <div><dt className="text-xs opacity-70">Total time</dt><dd className="text-sm font-semibold mt-1">{recipe.totalTime > 0 ? `${recipe.totalTime} min` : "Not provided"}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-2">{recipe.dietLabels.map((label) => <span key={label} className="rounded-full bg-orange-50 text-sm px-3 py-1">{label}</span>)}</div>
        </div>
      </div>
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 mt-6">
        <section className="bg-white p-6 md:p-8 rounded-3xl">
          <h2 className="text-2xl font-semibold">Ingredients</h2>
          <p className="text-sm opacity-70 mt-2 mb-4">For {servings || "the listed"} servings</p>
          <ul className="divide-y">{recipe.ingredientLines.map((line, index) => <li key={index} className="py-3 flex gap-3"><span aria-hidden="true" className="text-pink">•</span>{line}</li>)}</ul>
        </section>
        <div className="space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold">Nutrition</h2>
            <p className="text-sm opacity-70 mt-2">Estimated per serving</p>
            <dl className="grid grid-cols-2 gap-5 mt-5">{[["Energy", recipe.calories, "kcal"], ["Protein", recipe.totalNutrients.PROCNT?.quantity, "g"], ["Carbs", recipe.totalNutrients.CHOCDF?.quantity, "g"], ["Fat", recipe.totalNutrients.FAT?.quantity, "g"]].map(([label, value, unit]) => <div key={label}><dt className="text-sm opacity-70">{label}</dt><dd className="text-xl font-semibold">{servings > 0 && Number.isFinite(value) ? `${Math.round(value / servings)} ${unit}` : "Not provided"}</dd></div>)}</dl>
          </section>
          <section className="bg-orange-50 p-6 md:p-8 rounded-3xl">
            <h2 className="text-xl font-semibold">Cooking instructions</h2>
            <p className="text-sm leading-relaxed mt-3">Step-by-step directions aren’t included in this recipe collection. You can find the original method at {recipe.source}.</p>
            <a className="inline-block text-pink underline font-semibold mt-4" href={recipe.url} target="_blank" rel="noopener noreferrer">Original source ↗<span className="sr-only"> (opens in a new tab)</span></a>
          </section>
        </div>
      </div>
    </article>
  );
}
