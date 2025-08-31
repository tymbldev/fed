import { notFound } from 'next/navigation';
import { isJobDetailsSeoSlug, parseJobDetailsSeoSlug, isSeoSlug, isCompanySeoSlug, parseCompanySeoSlug } from '../utils/seo';

// Import the page components
import ReferralsListing from '../referrals/Listing';
import ReferralDetailsPage from './ReferralDetailsPage';
import CompanyDetailsPage from './CompanyDetailsPage';

interface SeoRouterProps {
  slug: string[];
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SeoRouter({ slug, searchParams }: SeoRouterProps) {
  const fullSlug = slug.join('/').toLowerCase();

  // Route 1: Job Details URLs (with -jid- identifier)
  if (isJobDetailsSeoSlug(fullSlug)) {
    const { jobId: parsedJobId } = parseJobDetailsSeoSlug(fullSlug);
    if (!parsedJobId) {
      return notFound();
    }

    // Pass the jobId as params to match the original [id] route structure
    const params = Promise.resolve({ id: parsedJobId.toString() });
    return <ReferralDetailsPage params={params} />;
  }

  // Route 2: Company Details URLs (with -cid- identifier)
  if (isCompanySeoSlug(fullSlug)) {
    const { companyId: parsedCompanyId } = parseCompanySeoSlug(fullSlug);
    if (!parsedCompanyId) {
      return notFound();
    }

    // Pass the companyId as params to match the original [id] route structure
    const params = Promise.resolve({ id: parsedCompanyId.toString() });
    return <CompanyDetailsPage params={params} />;
  }

  // Route 3: Listing URLs (without -jid- or -cid-)
  if (isSeoSlug(fullSlug) && !isJobDetailsSeoSlug(fullSlug)) {
    // Pass the seoSlug directly to the listing component
    return <ReferralsListing searchParams={searchParams} seoSlug={fullSlug} />;
  }

  // Route 4: Invalid URLs
  return notFound();
}
