import RecipeListing from '@/components/recipes/recipeListing';
import JsonLd from '@/components/JsonLd';
import { recipes, sections, searchRecipes, recipeHref } from '@/lib/recipes';
import { pageMetadata, collectionStructuredData } from '@/lib/seo.mjs';

function listing(params) {
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const sectionKey = typeof params.section === 'string' && Object.hasOwn(sections, params.section) ? params.section : null;
  const section = sectionKey ? sections[sectionKey] : null;
  const title = query ? `Search results for “${query}”` : section?.title || 'All Recipes';
  const description = query ? `Recipes with “${query}” in their names. Browse matching dishes and view ingredients and nutrition.` : 'Browse our pizza recipe collection. Open a recipe for ingredients, servings, estimated nutrition, and its original publisher.';
  const path = query ? undefined : sectionKey === 'popular' ? '/popular' : sectionKey ? `/recipe?section=${sectionKey}` : '/recipe';
  return { query, title, description, path, recipes: query ? searchRecipes(query) : section?.recipes || recipes };
}

export async function generateMetadata({ searchParams }) {
  const data = listing(await searchParams);
  return pageMetadata({ ...data, index: !data.query });
}

export default async function Page({ searchParams }) {
  const data = listing(await searchParams);
  return <>
    {!data.query && <JsonLd data={collectionStructuredData(data.title, data.description, data.path, data.recipes.map(recipe => ({ name: recipe.label, path: recipeHref(recipe) })))} />}
    <RecipeListing {...data} title={data.query ? 'Search Recipes' : data.title} />
  </>;
}
