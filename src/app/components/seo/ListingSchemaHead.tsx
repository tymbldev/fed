import { headers } from 'next/headers';
import { splitSeoSlug } from '../../utils/seo';
import { fetchLocations } from '../../utils/serverData';
import { BASE_URL } from '../../services/api';
import GlobalMetaHead from './GlobalMetaHead';

type Props = {
  seoSlug?: string;
};

interface Referral {
  id: number;
  title: string;
}

async function resolveLocation(locationName: string): Promise<{ city: string; country: string }> {
  try {
    const locationsMap = await fetchLocations();
    const normalizedTarget = locationName.toLowerCase();

    for (const key of Object.keys(locationsMap)) {
      const loc = locationsMap[Number(key)];
      if (loc.city.toLowerCase() === normalizedTarget) {
        return { city: loc.city, country: '' };
      }
    }

    for (const key of Object.keys(locationsMap)) {
      const loc = locationsMap[Number(key)];
      if (loc.country.toLowerCase() === normalizedTarget) {
        return { city: '', country: loc.country };
      }
    }

    return { city: '', country: locationName };
  } catch {
    return { city: '', country: locationName };
  }
}

async function fetchReferralsForHead(searchFilters: { keyword: string; country: string; city: string }) {
  const requestBody: { page: number; size: number; keywords?: string[]; countryName?: string; cityName?: string } = {
    page: 0,
    size: 20,
  };

  if (searchFilters.keyword) requestBody.keywords = [searchFilters.keyword];
  if (searchFilters.country) requestBody.countryName = searchFilters.country;
  if (searchFilters.city) requestBody.cityName = searchFilters.city;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/jobsearch/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });
    if (!response.ok) return { referrals: [], totalElements: 0 };
    const data = await response.json();
    const referrals = (data.jobs || data.content || data.data || data || []) as Referral[];
    const totalElements = data.totalElements || data.totalCount || data.total || referrals.length || 0;
    return { referrals: Array.isArray(referrals) ? referrals : [], totalElements };
  } catch {
    return { referrals: [], totalElements: 0 };
  }
}

function toTitleCase(text: string) {
  return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}

export default async function ListingSchemaHead({ seoSlug, renderMeta = true }: Props & { renderMeta?: boolean }) {
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  let keyword = '';
  let city = '';
  let country = '';

  if (seoSlug) {
    const { keyword: kw, location } = splitSeoSlug(seoSlug);
    if (location) {
      const resolved = await resolveLocation(location);
      city = resolved.city;
      country = resolved.country;
    }
    keyword = kw;
  }

  const crumbName = keyword ? `${toTitleCase(keyword)} Jobs` : 'Referrals';
  const basePath = seoSlug ? `/${seoSlug}` : '/referrals';
  const listingUrl = `${origin}${basePath}`;

  const { referrals, totalElements } = await fetchReferralsForHead({ keyword, city, country });

  const siteName = 'TymblHub';
  const locationSuffix = city ? ` in ${city}` : country ? ` in ${country}` : '';
  const title = keyword ? `${toTitleCase(keyword)} Jobs${locationSuffix} | ${siteName}` : `Referrals | ${siteName}`;
  const description = keyword
    ? `Browse ${totalElements || 'the latest'} ${toTitleCase(keyword)} jobs${locationSuffix}. Apply now on ${siteName}.`
    : `Discover curated job referrals${locationSuffix}. Apply now on ${siteName}.`;
  const ogImage = `${origin}/logo.png`;

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
    numberOfItems: totalElements || referrals.length,
    url: listingUrl,
    name: crumbName,
    itemListElement: referrals.map((referral, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${origin}/referrals/${referral.id}`,
      name: referral.title,
    })),
  } as const;

  return (
    <>
      {renderMeta ? (
        <>
          <GlobalMetaHead
            title={title}
            description={description}
            canonicalUrl={listingUrl}
            robots="index,follow"
            og={{ title, description, url: listingUrl, image: ogImage, siteName, type: 'website' }}
            includeLegacyDefaults
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={ogImage} />
        </>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}


