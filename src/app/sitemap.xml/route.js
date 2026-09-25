import { recipes, recipeHref } from '@/lib/recipes';
import { sitemapXml } from '@/lib/seo.mjs';

// Explicit XML route for compatibility with this project's Next.js 15 RC.
export const dynamic = 'force-static';

export function GET() {
  const paths = ['/', '/recipe', '/popular', '/recipe?section=trending', '/recipe?section=newest', ...recipes.map(recipeHref)];
  return new Response(sitemapXml(paths), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
