import GlobalMetaHead from '../components/seo/GlobalMetaHead';

export default function Head() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = 'TymblHub';
  const title = `Search Referrals | ${siteName}`;
  const description = `Search curated job referrals by keyword, location, and experience. Apply now on ${siteName}.`;
  const listingUrl = `${origin}/search-referrals`;

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': `${origin}/`, name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': listingUrl, name: 'Search Referrals' } },
    ],
  }).replace(/</g, '\\u003c');

  const itemList = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: listingUrl,
    name: 'Search Referrals',
  }).replace(/</g, '\\u003c');

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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${origin}/logo.png`} />
      <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <script id="schema-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
    </>
  );
}



