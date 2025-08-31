import { headers } from 'next/headers';
import { fetchReferralDetails } from '../../utils/serverData';
import { parseJobDetailsSeoSlug, isJobDetailsSeoSlug, buildJobDetailsSeoPath } from '../../utils/seo';
import { notFound } from 'next/navigation';

export default async function Head({
  params,
}: {
  params: Promise<{ jobSlug: string[] }>;
}) {
  const { jobSlug } = await params;
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  // Join the slug array to get the full path
  const fullSlug = jobSlug.join('/');

  let jobId: string;

  // Check if this is a SEO-friendly URL or a numeric ID
  if (isJobDetailsSeoSlug(fullSlug)) {
    // Parse SEO-friendly URL
    const { jobId: parsedJobId } = parseJobDetailsSeoSlug(fullSlug);
    if (!parsedJobId) {
      notFound();
    }
    jobId = parsedJobId.toString();
  } else {
    // Check if it's a numeric ID (legacy format)
    if (jobSlug.length === 1 && /^\d+$/.test(jobSlug[0])) {
      jobId = jobSlug[0];
    } else {
      notFound();
    }
  }

  const referral = await fetchReferralDetails(jobId);

  if (!referral) {
    return (
      <>
        <title>Job Not Found</title>
        <meta name="description" content="The requested job could not be found." />
      </>
    );
  }

  const title = `${referral.title} at ${referral.companyName}`;
  const description = referral.description
    ? referral.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : `Apply for ${referral.title} position at ${referral.companyName}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${origin}${buildJobDetailsSeoPath({
        title: referral.title,
        cityName: referral.cityName || '',
        countryName: referral.countryName || '',
        companyName: referral.companyName,
        minExperience: referral.minExperience || 0,
        maxExperience: referral.maxExperience || 0,
        id: referral.id
      })}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={`${origin}${buildJobDetailsSeoPath({
        title: referral.title,
        cityName: referral.cityName || '',
        countryName: referral.countryName || '',
        companyName: referral.companyName,
        minExperience: referral.minExperience || 0,
        maxExperience: referral.maxExperience || 0,
        id: referral.id
      })}`} />
    </>
  );
}
