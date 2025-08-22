import { cookies, headers } from 'next/headers';
import ReferralDetailsClient from './ReferralDetailsClient';
import {
  fetchReferralDetails,
  fetchCurrencies,
  fetchLocations,
  fetchReferrers,
  fetchApplicationStatus
} from '../../utils/serverData';
import Link from 'next/link';

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

    console.log('referral', referral);

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatSalaryRange(minSalary: number, maxSalary: number, currencyId: number, currencies: { [key: number]: string }) {
  // Treat 0 values as "not mentioned"
  const minIsZero = (minSalary ?? 0) === 0;
  const maxIsZero = (maxSalary ?? 0) === 0;

  if (minIsZero && maxIsZero) {
    return 'Not mentioned';
  }

  const currency = currencies[currencyId] || 'USD';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Only max provided (min is 0 or missing)
  if ((minIsZero || !minSalary) && !!maxSalary) {
    return `Up to ${formatter.format(maxSalary)}`;
  }

  // Only min provided (max is 0 or missing)
  if (!!minSalary && (maxIsZero || !maxSalary)) {
    return `${formatter.format(minSalary)}+`;
  }

  if (minSalary === maxSalary) {
    return formatter.format(minSalary);
  }

  return `${formatter.format(minSalary)} - ${formatter.format(maxSalary)}`;
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;
  const data = await getServerData(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Referral not found</div>
        </div>
      </div>
    );
  }

  const { referral, currencies, locations, referrers, applicationStatus, applicationId, appliedReferrer, applicationCreatedAt } = data;

  console.log("referral", referral);

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
          name: data.referral.company,
          logo: `${origin}/logo.png`,
        },
        identifier: {
          '@type': 'PropertyValue',
          name: data.referral.company,
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
        url: `${origin}/referrals/${data.referral.id}`,
      }
    : null;

  const jobPostingJson = jobPosting ? JSON.stringify(jobPosting).replace(/</g, '\\u003c') : '';

  return (
    <>
      {jobPosting ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingJson }} />
      ) : null}
      <main className="min-h-screen bg-[#f6fafd] py-4 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200 p-4 pb-0 md:p-8 text-left">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-left">{referral.title}</h1>
            <Link href={`/companies/${referral.companyId}`} className="text-base text-gray-500 font-medium mb-2 text-left hover:underline">{referral.company}</Link>
            <div className="flex items-center text-xs text-gray-400 mb-1 text-left">
              <span>Posted on {formatDate(referral.createdAt)}</span>
            </div>
            <hr className="my-4 border-gray-200" />
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Experience</div>
              <div className="text-base font-semibold text-gray-800">
                {referral.minExperience && referral.maxExperience
                  ? `${referral.minExperience} - ${referral.maxExperience} yrs`
                  : referral.minExperience
                  ? `${referral.minExperience}+ yrs`
                  : referral.maxExperience
                  ? `Up to ${referral.maxExperience} yrs`
                  : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Monthly Salary</div>
              <div className="text-base font-semibold text-gray-800">
                {formatSalaryRange(referral.minSalary, referral.maxSalary, referral.currencyId, currencies)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Job Location</div>
              <div className="text-base font-semibold text-gray-800">
                {locations[referral.cityId]?.city}, {locations[referral.cityId]?.country}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Vacancy</div>
              <div className="text-base font-semibold text-gray-800">{referral.openingCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Designation</div>
              <div className="text-base font-semibold text-gray-800">{referral.designation || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Job Type</div>
              <div className="text-base font-semibold text-gray-800">{referral.jobType || 'Not specified'}</div>
            </div>
          </div>
          <hr className="my-4 border-gray-200" />

          {/* Job Description Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-left">Job Description</h2>
            <div className="prose max-w-none text-gray-700 text-left" dangerouslySetInnerHTML={{ __html: referral.description }} />
          </div>



          {/* Keywords as pills above the apply button */}
          {referral.tags && referral.tags.length > 0 && (
            <>
            <hr className="my-4 border-gray-200" />
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2 text-left">Keywords</h3>
              <div className="flex flex-wrap gap-3 justify-start text-left">
                {referral.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold min-h-[2.25rem] flex items-center"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <hr className="my-4 border-gray-200" />
            </>
          )}



          {/* Application Status, Button & Referrer Information - Client Component */}
          {/* <div className="mt-8 sticky bottom-[10px] z-40"> */}
            <ReferralDetailsClient
              referral={referral}
              referrers={referrers}
              initialApplicationStatus={applicationStatus}
              initialApplicationId={applicationId}
              initialAppliedReferrer={appliedReferrer}
              applicationCreatedAt={applicationCreatedAt}
            />
          {/* </div> */}
        </div>
      </div>
    </main>
    </>
  );
}