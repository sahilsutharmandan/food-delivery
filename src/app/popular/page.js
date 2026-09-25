import RecipeListing from '@/components/recipes/recipeListing';
import JsonLd from '@/components/JsonLd';
import { sections, recipeHref } from '@/lib/recipes';
import { pageMetadata, collectionStructuredData } from '@/lib/seo.mjs';

const description = 'Explore the Popular Recipes collection with ingredients, servings, and estimated nutrition. Each recipe includes attribution to its original publisher.';
export const metadata = pageMetadata({ title: 'Popular Recipes', description, path: '/popular' });

export default function Page() {
  return <>
    <JsonLd data={collectionStructuredData(sections.popular.title, description, '/popular', sections.popular.recipes.map(recipe => ({ name: recipe.label, path: recipeHref(recipe) })))} />
    <RecipeListing {...sections.popular} description={description} />
  </>;
}
