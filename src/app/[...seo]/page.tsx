import { splitSeoSlug, isJobDetailsSeoSlug, parseJobDetailsSeoSlug, isCompanySeoSlug, parseCompanySeoSlug } from '../utils/seo';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { fetchReferralDetails } from '../utils/serverData';
import SeoRouter from '../components/SeoRouter';

export default async function GlobalSeoPage({
  params,
  searchParams,
}: {
  params: Promise<{ seo: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { seo } = await params;

  return <SeoRouter slug={seo} searchParams={searchParams} />;
}

export async function generateMetadata({ params }: { params: Promise<{ seo: string[] }> }): Promise<Metadata> {
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  const { seo } = await params;
  const seoSlug = seo.join('/');
  const slug = seoSlug.toLowerCase();

    // Check if this is a job details URL
  if (isJobDetailsSeoSlug(slug)) {
    const { jobId: parsedJobId } = parseJobDetailsSeoSlug(slug);
    if (!parsedJobId) {
      return {
        title: 'Job Not Found',
        description: 'The requested job could not be found.',
      };
    }

    const jobId = parsedJobId.toString();
    const referral = await fetchReferralDetails(jobId);

    if (!referral) {
      return {
        title: 'Job Not Found',
        description: 'The requested job could not be found.',
      };
    }

    const title = `${referral.title} at ${referral.companyName}`;
    const description = referral.description
      ? referral.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
      : `Apply for ${referral.title} position at ${referral.companyName}`;

    return {
      title,
      description,
      alternates: {
        canonical: `${origin}/${slug}`
      },
      robots: { index: true, follow: true },
      openGraph: {
        title,
        description,
        url: `${origin}/${slug}`,
        siteName: 'TymblHub',
        type: 'website',
        images: [{ url: `${origin}/logo.png` }],
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  }

  // Check if this is a company details URL
  if (isCompanySeoSlug(slug)) {
    const { parsedData } = parseCompanySeoSlug(slug);
    const companyName = parsedData.companyName || 'Company';

    const title = `${companyName} Careers | TymblHub`;
    const description = `Explore job opportunities at ${companyName}. Find and apply for open positions through referrals.`;

    return {
      title,
      description,
      alternates: {
        canonical: `${origin}/${slug}`
      },
      robots: { index: true, follow: true },
      openGraph: {
        title,
        description,
        url: `${origin}/${slug}`,
        siteName: 'TymblHub',
        type: 'website',
        images: [{ url: `${origin}/logo.png` }],
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  }

  // Handle listing page metadata
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