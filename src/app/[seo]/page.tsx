import ReferralsListing from '../referrals/Listing';
import { isSeoSlug } from '../utils/seo';
import { notFound } from 'next/navigation';

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
  return ReferralsListing({ searchParams, seoSlug: slug });
}


