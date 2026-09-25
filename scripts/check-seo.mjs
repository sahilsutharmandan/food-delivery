import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:3027';
const configured = process.argv[3] !== 'unconfigured';
const recipes = JSON.parse(readFileSync(new URL('../public/foods.json', import.meta.url))).hits.map(hit => hit.recipe);
const recipePath = recipe => `/recipe/${recipe.uri.split('#recipe_')[1]}`;
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const meta = (html, name) => html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1];
const canonical = html => html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
async function get(path, status = 200) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, status, path);
  return response.text();
}

const paths = ['/', '/recipe', '/popular', '/recipe?section=trending', '/recipe?section=newest', ...recipes.map(recipePath)];
for (const path of paths) {
  const html = await get(path);
  assert(!html.includes('<title>Create Next App</title>'), path);
  assert(meta(html, 'description'), path);
  assert(meta(html, 'og:title'), path);
  assert(meta(html, 'twitter:card'), path);
  assert(meta(html, 'robots').includes(configured ? 'index, follow' : 'noindex, follow'), path);
  assert.equal(canonical(html) ? new URL(canonical(html)).href : undefined, configured ? `${base}${path}` : undefined, path);
  const structured = schemas(html);
  if (/^\/recipe\//.test(path)) {
    const recipe = recipes.find(item => recipePath(item) === path);
    const schema = structured.find(item => item['@type'] === 'Recipe');
    assert.equal(schema.name, recipe.label);
    assert.equal(schema.recipeIngredient.length, recipe.ingredientLines.length);
    assert.equal(schema.url, configured ? `${base}${path}` : undefined);
    assert.equal(structured.some(item => item['@type'] === 'BreadcrumbList'), configured);
    assert(html.includes('Step-by-step directions'));
    assert.equal(Boolean(schema.image), configured && !recipe.image.endsWith('/pizza-fallback.jpg'));
  }
  if (['/recipe', '/popular'].includes(path) && configured) {
    const collection = structured.find(item => item['@type'] === 'CollectionPage');
    assert(collection.mainEntity.itemListElement.length > 0);
  }
}
for (const path of ['/recipe?q=cherry', '/recipe?q=zzznomatch', '/recipe?q=cherry&section=popular']) {
  const html = await get(path);
  assert(meta(html, 'robots').includes('noindex, follow'));
  assert.equal(canonical(html), undefined);
  assert.equal(schemas(html).length, 0);
}
const alias = await get('/recipe?section=popular');
assert.equal(canonical(alias), configured ? `${base}/popular` : undefined);
const unknownSection = await get('/recipe?section=constructor');
assert.equal(canonical(unknownSection), configured ? `${base}/recipe` : undefined);
const missing = await get('/recipe/not-a-recipe', 404);
assert(missing.includes('noindex'));
const robots = await get('/robots.txt');
const sitemap = await get('/sitemap.xml');
if (configured) {
  assert(robots.includes('Allow: /'));
  assert(robots.includes(`Sitemap: ${base}/sitemap.xml`));
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(new Set(urls), new Set(paths.map(path => `${base}${path}`)));
  assert(!sitemap.includes('lastmod'));
} else {
  assert(robots.includes('Disallow: /'));
  assert(!robots.includes('Sitemap:'));
  assert(!sitemap.includes('<loc>'));
}
console.log(`PASS: ${configured ? 'configured' : 'unconfigured'} SEO; ${paths.length} pages, search noindex, section aliases, 404, structured data, robots and sitemap.`);
