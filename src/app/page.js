import HomePage from '@/components/home/homePage';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, siteUrl, siteName, siteDescription } from '@/lib/seo.mjs';

export const metadata = pageMetadata({ title: 'Pizza Recipes & Food Inspiration', description: siteDescription, path: '/' });

export default function Page() {
  return <>
    <JsonLd data={siteUrl ? { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: siteName, description: siteDescription, inLanguage: 'en' } : null} />
    <HomePage />
  </>;
}
