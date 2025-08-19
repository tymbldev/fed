import ReferralsListing from '../referrals/Listing';
import { isSeoSlug, splitSeoSlug } from '../utils/seo';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import ListingSchemaHead from '../components/seo/ListingSchemaHead';

export default async function SeoReferralsPage({
  params,
  searchParams,
}: {
  params: Promise<{ seo: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { seo } = await params;
  const slug = (seo || '').toLowerCase();
  if (!isSeoSlug(slug)) return notFound();

  return (
    <>
      <ListingSchemaHead seoSlug={slug} renderMeta={false} />
      {ReferralsListing({ searchParams, seoSlug: slug })}
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ seo: string }> }): Promise<Metadata> {
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  const { seo } = await params;
  const slug = (seo || '').toLowerCase();
  const { keyword } = splitSeoSlug(slug);

  const siteName = 'TymblHub';
  const toTitleCase = (t: string) => t.replace(/\w\S*/g, (s) => s.charAt(0).toUpperCase() + s.slice(1));
  const title = keyword ? `${toTitleCase(keyword)} Jobs | ${siteName}` : `Referrals | ${siteName}`;
  const description = keyword
    ? `Browse ${toTitleCase(keyword)} jobs. Apply now on ${siteName}.`
    : `Discover curated job referrals. Apply now on ${siteName}.`;
  const listingUrl = `${origin}/${slug}`;
  const ogImage = `${origin}/logo.png`;

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
      images: [{ url: ogImage }],
    },
  };
}


