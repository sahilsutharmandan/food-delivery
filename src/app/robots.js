import { siteUrl, absoluteUrl } from '@/lib/seo.mjs';

export default function robots() {
  // Unconfigured previews should not advertise a guessed production domain.
  if (!siteUrl) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
