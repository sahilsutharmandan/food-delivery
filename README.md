# design idea

https://dribbble.com/shots/18302151-Food-Delivery-Landing-Page-Design

https://dribbble.com/shots/16959340-Restaurant-Website-Design-UI-Exploration

https://dribbble.com/shots/16935648-Latest-Food-Delivery-Website-UI-Design

# Colors

https://colorhunt.co/palette/eeedebe6b9a69391852f3645

## SEO and AI search readiness

Set `SITE_URL` to the site's public origin **before `npm run build`** once a production domain exists, and keep the same value in the server runtime environment. Copy `.env.example` to `.env.local` for local configuration, or set it in the hosting provider's build and server runtime environments. Use an origin such as `https://your-domain.com`, without a path, query, credentials, or fragment. Rebuild after changing it; metadata routes are generated at build time.

Without `SITE_URL`, pages use `noindex`, robots.txt disallows crawling, the sitemap is empty, and absolute canonical/social URLs are omitted. This is intentional for an unconfigured preview. No production domain is assumed.

Configured deployments include:

- Unique titles/descriptions, canonical URLs, Open Graph and Twitter sharing metadata.
- A sitemap of the homepage, recipe collections, and every recipe detail URL. The duplicate Popular collection query URL canonicalizes to `/popular` and is excluded from the sitemap.
- `noindex, follow` for internal search results, which remain crawlable so crawlers can read that instruction.
- Server-rendered Recipe, BreadcrumbList, CollectionPage/ItemList, and homepage WebSite JSON-LD, with escaped script content.
- Visible factual recipe summaries and original-publisher attribution. Recipe ingredients and nutrition are available in the initial HTML without JavaScript.

Structured data does not invent cooking directions, authors, ratings, dates, or cooking times. Nutrition matches the displayed per-serving estimates. Generic fallback photos are excluded from Recipe image markup and use the brand illustration in social previews. Recipes lacking a genuine image will not meet Google's required image field for recipe rich results. The collection has no cooking directions; adding complete, sourced content is a future content improvement, not something metadata can replace.

GEO here means making the same useful, attributed content accessible to search and AI systems. No special AI-only content, fabricated FAQ, or ranking promises are added. Google describes the same crawlability and content foundations for its AI search features: https://developers.google.com/search/docs/appearance/ai-features

Validation:

- `npm run test:seo` tests URL configuration, metadata, data accuracy across every recipe, and JSON-LD escaping.
- `npm run build` checks the production application.
- With a server built using `SITE_URL=http://localhost:3027` and running on that port: `npm run check:seo -- http://localhost:3027` checks the actual HTML of all indexable routes plus search, aliases, 404s, robots, and sitemap.
- With `SITE_URL` unset and a rebuilt server: `npm run check:seo -- http://localhost:3027 unconfigured` verifies preview behavior.

After production deployment, submit `/sitemap.xml` to Search Console and validate representative recipe URLs with Google's Rich Results Test and URL Inspection. Local checks do not prove indexing or inclusion in AI answers.
