import RecipeListing from "@/components/recipes/recipeListing";
import { recipes, sections, searchRecipes } from "@/lib/recipes";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const section = typeof params.section === "string" ? sections[params.section] : null;
  return <RecipeListing title={query ? "Search Recipes" : section?.title || "All Recipes"} recipes={query ? searchRecipes(query) : section?.recipes || recipes} query={query} />;
}
