import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  parseSiteUrl, absoluteUrl, pageMetadata, recipeSummary, recipeStructuredData,
  collectionStructuredData, breadcrumbStructuredData, serializeJsonLd, sitemapXml,
} from '../src/lib/seo.mjs';

const recipes = JSON.parse(readFileSync(new URL('../public/foods.json', import.meta.url))).hits.map(hit => hit.recipe);
const origin = 'https://food.example';
const path = '/recipe/test';

test('public origin configuration rejects paths, credentials and non-web schemes', () => {
  assert.equal(parseSiteUrl(''), null);
  assert.equal(parseSiteUrl(' https://food.example/ '), origin);
  for (const value of ['javascript:alert(1)', 'https://user:pass@food.example', 'https://food.example/app', 'https://food.example?q=x', 'https://food.example/#x', 'not a URL']) {
    assert.throws(() => parseSiteUrl(value));
  }
  assert.equal(absoluteUrl('/recipe', origin), `${origin}/recipe`);
  assert.equal(absoluteUrl('/recipe', null), undefined);
});

test('metadata has consistent canonical and social URLs, with indexable configured pages', () => {
  const metadata = pageMetadata({ title: 'All Recipes', description: 'Browse recipes', path: '/recipe' }, origin);
  assert.equal(metadata.alternates.canonical, `${origin}/recipe`);
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.twitter.images[0].url, metadata.openGraph.images[0].url);
  assert.equal(metadata.robots.index, true);
  assert.equal(metadata.openGraph.title, 'All Recipes | Food.');
});

test('search results are noindex,follow without a misleading browse-page canonical', () => {
  const metadata = pageMetadata({ title: 'Search cherry', description: 'Search results', index: false }, origin);
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.follow, true);
  assert.equal(metadata.alternates, undefined);
});

test('unconfigured deployments emit neither guessed URLs nor indexable metadata', () => {
  const metadata = pageMetadata({ title: 'Recipes', description: 'Recipes', path: '/recipe' }, null);
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.alternates, undefined);
  assert.deepEqual(metadata.openGraph.images, []);
  assert.equal(collectionStructuredData('Recipes', '', '/recipe', [], null), null);
  assert.equal(breadcrumbStructuredData([], null), null);
});

test('all recipe schemas preserve source facts and use per-serving nutrition', () => {
  for (const recipe of recipes) {
    const schema = recipeStructuredData(recipe, path, origin);
    assert.equal(schema.name, recipe.label);
    assert.equal(schema.description, recipeSummary(recipe));
    assert.deepEqual(schema.recipeIngredient, recipe.ingredientLines);
    assert.equal(schema.isBasedOn.url, recipe.url);
    assert.equal(schema.isBasedOn.name, recipe.source);
    assert.equal(schema.url, `${origin}${path}`);
    assert.equal(schema.nutrition.calories, `${Math.round(recipe.calories / recipe.yield)} calories`);
    assert.equal(schema.totalTime, recipe.totalTime > 0 ? `PT${recipe.totalTime}M` : undefined);
    assert.equal(schema.image?.[0], recipe.image.endsWith('/pizza-fallback.jpg') ? undefined : `${origin}${recipe.image}`);
    for (const absent of ['author', 'datePublished', 'dateModified', 'aggregateRating', 'recipeInstructions', 'prepTime', 'cookTime']) {
      assert.equal(schema[absent], undefined);
    }
  }
});

test('unknown servings, time and images do not produce invented nutrition or zero-minute recipes', () => {
  const recipe = { ...recipes[0], yield: 0, totalTime: 0, image: '' };
  const schema = recipeStructuredData(recipe, path, origin);
  for (const absent of ['recipeYield', 'nutrition', 'totalTime', 'image']) assert.equal(schema[absent], undefined);
});

test('collection and breadcrumb entities link to ordered internal pages', () => {
  const items = [{ name: 'First recipe', path: '/recipe/one' }, { name: 'Second recipe', path: '/recipe/two' }];
  const collection = collectionStructuredData('Recipes', 'Collection', '/recipe', items, origin);
  assert.equal(collection.mainEntity.numberOfItems, 2);
  assert.equal(collection.mainEntity.itemListElement[1].position, 2);
  assert.equal(collection.mainEntity.itemListElement[0].url, `${origin}/recipe/one`);
  const breadcrumb = breadcrumbStructuredData(items, origin);
  assert.equal(breadcrumb.itemListElement[1].item, `${origin}/recipe/two`);
});

test('JSON-LD escapes script-closing input while retaining the original data', () => {
  const data = { name: '</script><script>alert("unsafe")</script>' };
  const serialized = serializeJsonLd(data);
  assert.equal(serialized.includes('<'), false);
  assert.deepEqual(JSON.parse(serialized), data);
});


test('sitemap escapes XML and emits no guessed URLs when unconfigured', () => {
  assert(sitemapXml(['/recipe?a=one&b=two'], origin).includes('/recipe?a=one&amp;b=two</loc>'));
  assert(!sitemapXml(['/recipe'], null).includes('<loc>'));
});
