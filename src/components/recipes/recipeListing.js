import Link from "next/link";

export default function RecipeListing({ title, recipes, query }) {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {query && <p className="mt-3 break-words">Results for “{query}”</p>}
      <p className="mt-3 opacity-80">{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}</p>
      {recipes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recipes.map((recipe) => (
            <article key={recipe.uri} className="min-w-0 p-5 bg-white shadow rounded-3xl">
              <h2 className="text-xl font-semibold">{recipe.label}</h2>
              <p className="mt-3 opacity-80">{recipe.mealType.join(", ")}</p>
              <p className="mt-2 text-sm">{recipe.ingredientLines.length} ingredients · {recipe.source}</p>
              <a className="inline-block mt-4 font-semibold text-pink underline" href={recipe.url} target="_blank" rel="noopener noreferrer">View recipe<span className="sr-only"> (opens in a new tab)</span></a>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8"><p>No recipes found. Try another recipe name or ingredient.</p><Link className="inline-block mt-4 text-pink underline" href="/recipe">Browse all recipes</Link></div>
      )}
    </section>
  );
}
