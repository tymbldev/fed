import { cookies, headers } from 'next/headers';
import ReferralDetailsClient from '../[id]/ReferralDetailsClient';
import {
  fetchReferralDetails,
  fetchCurrencies,
  fetchLocations,
  fetchReferrers,
  fetchApplicationStatus
} from '../../utils/serverData';
import { parseJobDetailsSeoSlug, isJobDetailsSeoSlug, buildJobDetailsSeoPath } from '../../utils/seo';
// import Link from 'next/link';
import { notFound } from 'next/navigation';

// Force dynamic rendering since this page uses cookies for authentication
export const dynamic = 'force-dynamic';

async function getServerData(jobId: string) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value || null;

    // Fetch all data in parallel
    const [referral, currencies, locations, referrers, applicationData] = await Promise.all([
      fetchReferralDetails(jobId),
      fetchCurrencies(),
      fetchLocations(),
      fetchReferrers(jobId),
      fetchApplicationStatus(jobId, token)
    ]);

    if (!referral) {
      return null;
    }

    // Find applied referrer if user has applied
    let appliedReferrer = null;
    if (applicationData.application?.jobReferrerId) {
      const referrer = referrers.find(ref => ref.userId === applicationData.application!.jobReferrerId);
      if (referrer) {
        appliedReferrer = {
          id: referrer.userId,
          name: referrer.userName,
          designation: referrer.designation
        };
      }
    }

    return {
      referral,
      currencies,
      locations,
      referrers,
      applicationStatus: applicationData.status,
      applicationId: applicationData.application?.id || null,
      appliedReferrer,
      applicationCreatedAt: applicationData.application?.createdAt || null
    };
  } catch (error) {
    console.error('Error fetching server data:', error);
    return null;
  }
}



function stripHtmlTags(html: string) {
  try {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch {
    return html;
  }
}

export default async function ReferralDetailsPage({
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

  const data = await getServerData(jobId);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Referral not found</div>
        </div>
      </div>
    );
  }

  const { referral, referrers, applicationStatus, applicationId, appliedReferrer, applicationCreatedAt } = data;

  const city = data ? data.locations[data.referral.cityId]?.city : undefined;
  const country = data ? data.locations[data.referral.cityId]?.country : undefined;
  const currencyCode = data ? data.currencies[data.referral.currencyId] : undefined;

  const jobPosting = data
    ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: data.referral.title,
        description: stripHtmlTags(data.referral.description),
        datePosted: data.referral.createdAt,
        employmentType: data.referral.jobType || undefined,
        hiringOrganization: {
          '@type': 'Organization',
          name: data.referral.companyName,
          logo: `${origin}/logo.png`,
        },
        identifier: {
          '@type': 'PropertyValue',
          name: data.referral.companyName,
          value: String(data.referral.id),
        },
        jobLocation: city || country
          ? {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: city || undefined,
                addressCountry: country || undefined,
              },
            }
          : undefined,
        estimatedSalary:
          (data.referral.minSalary || data.referral.maxSalary) && currencyCode
            ? {
                '@type': 'MonetaryAmount',
                currency: currencyCode,
                value: {
                  '@type': 'QuantitativeValue',
                  minValue: data.referral.minSalary || undefined,
                  maxValue: data.referral.maxSalary || undefined,
                },
              }
            : undefined,
        jobBenefits: undefined,
        skills:
          data.referral.tags && data.referral.tags.length > 0
            ? data.referral.tags.join(', ')
            : undefined,
        experienceRequirements:
          data.referral.minExperience || data.referral.maxExperience
            ? `${data.referral.minExperience ?? ''}${
                data.referral.minExperience && data.referral.maxExperience ? ' - ' : ''
              }${data.referral.maxExperience ?? ''} years`.trim()
            : undefined,
        url: `${origin}${buildJobDetailsSeoPath({
          title: data.referral.title,
          cityName: data.locations[data.referral.cityId]?.city || '',
          countryName: data.locations[data.referral.cityId]?.country || '',
          companyName: data.referral.companyName,
          minExperience: data.referral.minExperience || 0,
          maxExperience: data.referral.maxExperience || 0,
          id: data.referral.id
        })}`,
      }
    : null;

  const jobPostingJson = jobPosting ? JSON.stringify(jobPosting).replace(/</g, '\\u003c') : '';

  return (
    <>
      {jobPostingJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jobPostingJson }}
        />
      )}
      <ReferralDetailsClient
        referral={referral}
        referrers={referrers}
        initialApplicationStatus={applicationStatus}
        initialApplicationId={applicationId}
        initialAppliedReferrer={appliedReferrer}
        applicationCreatedAt={applicationCreatedAt}
      />
    </>
  );
}
