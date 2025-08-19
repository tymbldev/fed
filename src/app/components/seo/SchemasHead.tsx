import GlobalMetaHead from './GlobalMetaHead';

function toTitleCase(text: string) {
  return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}

function deriveFromSlug(seoSlug?: string): { keyword: string; locationSuffix: string } {
  if (!seoSlug) return { keyword: '', locationSuffix: '' };
  const slug = seoSlug.toLowerCase();
  // crude parse: "<keyword>-jobs-in-<location>" | "<keyword>-jobs" | "jobs-in-<location>"
  if (slug.startsWith('jobs-in-')) {
    const location = slug.replace(/^jobs-in-/, '');
    return { keyword: '', locationSuffix: location ? ` in ${toTitleCase(location.replace(/-/g, ' '))}` : '' };
  }
  if (slug.includes('-jobs-in-')) {
    const [rawKeyword, rawLocation] = slug.split('-jobs-in-');
    const keyword = toTitleCase(rawKeyword.replace(/-/g, ' '));
    const location = toTitleCase(rawLocation.replace(/-/g, ' '));
    return { keyword, locationSuffix: location ? ` in ${location}` : '' };
  }
  if (slug.endsWith('-jobs')) {
    const keyword = toTitleCase(slug.slice(0, -('-jobs'.length)).replace(/-/g, ' '));
    return { keyword, locationSuffix: '' };
  }
  return { keyword: '', locationSuffix: '' };
}

export default function SchemasHead({ seoSlug }: { seoSlug?: string }) {
  console.log('seoSlug', seoSlug);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = 'TymblHub';

  const basePath = seoSlug ? `/${seoSlug}` : '/referrals';
  const listingUrl = `${origin}${basePath}`;

  const { keyword, locationSuffix } = deriveFromSlug(seoSlug);
  const crumbName = keyword ? `${keyword} Jobs` : 'Referrals';
  const title = keyword ? `${keyword} Jobs${locationSuffix} | ${siteName}` : `Referrals | ${siteName}`;
  const description = keyword
    ? `Browse ${keyword} jobs${locationSuffix}. Apply now on ${siteName}.`
    : `Discover curated job referrals${locationSuffix}. Apply now on ${siteName}.`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': `${origin}/`, name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': listingUrl, name: crumbName } },
    ],
  } as const;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: listingUrl,
    name: crumbName,
  } as const;

  const breadcrumbJson = JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c');
  const itemListJson = JSON.stringify(itemListSchema).replace(/</g, '\\u003c');

  return (
    <>
      <GlobalMetaHead
        title={title}
        description={description}
        canonicalUrl={listingUrl}
        robots="index,follow"
        og={{ title, description, url: listingUrl, image: `${origin}/logo.png`, siteName, type: 'website' }}
        includeLegacyDefaults
      />
      <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJson }} />
      <script id="schema-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJson }} />
    </>
  );
}


