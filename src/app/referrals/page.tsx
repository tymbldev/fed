import ReferralsListing from './Listing';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export default function ReferralsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return ReferralsListing(props);
}

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  const siteName = 'TymblHub';
  const title = `Referrals | ${siteName}`;
  const description = `Discover curated job referrals. Apply now on ${siteName}.`;
  const listingUrl = `${origin}/referrals`;

  return {
    title,
    description,
    alternates: { canonical: listingUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: listingUrl,
      siteName,
      type: 'website',
      images: [{ url: `${origin}/logo.png` }],
    },
  };
}