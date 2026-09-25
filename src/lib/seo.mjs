// Set SITE_URL to the public origin for both the build and server runtime. Never infer it from request headers.
export function parseSiteUrl(value) {
  if (!value?.trim()) return null;
  const url = new URL(value.trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) origin without a path, credentials, query, or fragment.');
  }
  return url.origin;
}

export const siteUrl = parseSiteUrl(process.env.SITE_URL);
export const siteName = 'Food.';
export const siteDescription = 'Explore pizza recipes with ingredients, servings, estimated nutrition, and links to the original recipe publishers.';
export const defaultSocialImage = '/images/banner-bg-img.png';

export function absoluteUrl(path, origin = siteUrl) {
  return origin ? new URL(path, `${origin}/`).href : undefined;
}

export function pageMetadata({ title, description, path, image = defaultSocialImage, imageAlt = 'Food. recipe collection', index = true }, origin = siteUrl) {
  const url = path ? absoluteUrl(path, origin) : undefined;
  const imageUrl = absoluteUrl(image, origin);
  const socialTitle = `${title} | ${siteName}`;
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    robots: { index: Boolean(origin) && index, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title: socialTitle, description, siteName, type: 'website', locale: 'en_US',
      ...(url ? { url } : {}),
      images: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary', title: socialTitle, description,
      images: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
    },
  };
}

export function hasRecipePhoto(recipe) {
  return Boolean(recipe.image && !recipe.image.endsWith('/pizza-fallback.jpg'));
}

export function recipeSummary(recipe) {
  const servings = recipe.yield > 0 ? `, serving ${recipe.yield}` : '';
  const time = recipe.totalTime > 0 ? ` Total time: ${recipe.totalTime} minutes.` : '';
  return `${recipe.label} from ${recipe.source} has ${recipe.ingredientLines.length} ingredients${servings}.${time}`;
}

export function recipeStructuredData(recipe, path, origin = siteUrl) {
  const url = absoluteUrl(path, origin);
  const image = hasRecipePhoto(recipe) ? absoluteUrl(recipe.image, origin) : undefined;
  const nutrition = {};
  if (recipe.yield > 0) {
    for (const [key, value, unit] of [
      ['calories', recipe.calories, 'calories'],
      ['proteinContent', recipe.totalNutrients?.PROCNT?.quantity, 'g'],
      ['carbohydrateContent', recipe.totalNutrients?.CHOCDF?.quantity, 'g'],
      ['fatContent', recipe.totalNutrients?.FAT?.quantity, 'g'],
    ]) {
      if (Number.isFinite(value)) nutrition[key] = `${Math.round(value / recipe.yield)} ${unit}`;
    }
  }
  return {
    '@context': 'https://schema.org', '@type': 'Recipe',
    ...(url ? { '@id': `${url}#recipe`, url, mainEntityOfPage: url } : {}),
    name: recipe.label, description: recipeSummary(recipe), inLanguage: 'en',
    ...(image ? { image: [image] } : {}),
    recipeIngredient: recipe.ingredientLines,
    recipeCuisine: recipe.cuisineType,
    recipeCategory: recipe.mealType,
    ...(recipe.yield > 0 ? { recipeYield: `${recipe.yield} servings` } : {}),
    ...(recipe.totalTime > 0 ? { totalTime: `PT${recipe.totalTime}M` } : {}),
    ...(Object.keys(nutrition).length ? { nutrition: { '@type': 'NutritionInformation', ...nutrition } } : {}),
    // The dataset identifies the source, not an individual author or publication date.
    isBasedOn: { '@type': 'CreativeWork', name: recipe.source, url: recipe.url },
  };
}

export function breadcrumbStructuredData(items, origin = siteUrl) {
  if (!origin) return null;
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem', position: index + 1, name, item: absoluteUrl(path, origin),
    })),
  };
}

export function collectionStructuredData(title, description, path, items, origin = siteUrl) {
  if (!origin) return null;
  return {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: title, description, url: absoluteUrl(path, origin), inLanguage: 'en',
    mainEntity: {
      '@type': 'ItemList', numberOfItems: items.length,
      itemListElement: items.map(({ name, path: itemPath }, index) => ({
        '@type': 'ListItem', position: index + 1, name, url: absoluteUrl(itemPath, origin),
      })),
    },
  };
}

export function serializeJsonLd(data) {
  // Prevent a recipe title containing HTML from closing the JSON-LD script element.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function sitemapXml(paths, origin = siteUrl) {
  const escapeXml = value => value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]));
  const entries = origin ? paths.map(path => `<url><loc>${escapeXml(absoluteUrl(path, origin))}</loc></url>`).join('\n') : '';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}
