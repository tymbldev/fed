import ReferralsListing from '../referrals/Listing';
import { isSeoSlug } from '../utils/seo';
import { notFound } from 'next/navigation';

export default function SeoReferralsPage({
  params,
  searchParams,
}: {
  params: { seo: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const slug = (params.seo || '').toLowerCase();
  if (!isSeoSlug(slug)) return notFound();
  return ReferralsListing({ searchParams, seoSlug: slug });
}


