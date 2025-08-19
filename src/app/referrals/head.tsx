export default function Head() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const listingUrl = `${origin}/referrals`;
  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': `${origin}/`, name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': listingUrl, name: 'Referrals' } },
    ],
  }).replace(/</g, '\\u003c');
  const itemList = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: listingUrl,
    name: 'Referrals',
  }).replace(/</g, '\\u003c');
  return (
    <>
      <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <script id="schema-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
    </>
  );
}


