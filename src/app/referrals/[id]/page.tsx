import { cookies } from 'next/headers';
import ReferralDetailsClient from './ReferralDetailsClient';
import {
  fetchReferralDetails,
  fetchCurrencies,
  fetchLocations,
  fetchReferrers,
  fetchApplicationStatus
} from '../../utils/serverData';

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
      appliedReferrer
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
  const currency = currencies[currencyId] || 'USD';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });

  if (minSalary === maxSalary) {
    return formatter.format(minSalary);
  }

  return `${formatter.format(minSalary)} - ${formatter.format(maxSalary)}`;
}

export default async function ReferralDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { referral, currencies, locations, referrers, applicationStatus, applicationId, appliedReferrer } = data;

  return (
    <main className="min-h-screen bg-[#f6fafd] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-left">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-left">{referral.title}</h1>
            <div className="text-base text-gray-500 font-medium mb-2 text-left">{referral.company}</div>
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
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-left" dangerouslySetInnerHTML={{ __html: referral.description }} />
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Keywords as pills above the apply button */}
          {referral.tags && referral.tags.length > 0 && (
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
          )}

          <hr className="my-4 border-gray-200" />

          {/* Application Status, Button & Referrer Information - Client Component */}
          <div className="mt-8">
            <ReferralDetailsClient
              referral={referral}
              referrers={referrers}
              initialApplicationStatus={applicationStatus}
              initialApplicationId={applicationId}
              initialAppliedReferrer={appliedReferrer}
            />
          </div>
        </div>
      </div>
    </main>
  );
}