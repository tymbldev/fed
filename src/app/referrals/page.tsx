import { Suspense } from 'react';
import { BASE_URL } from '../services/api';
import ReferralStatusBadge from './ReferralStatusBadge';
import FloatingFilterButton from '../components/FloatingFilterButton';
import JobTuple from '../components/JobTuple';
import CurrentSearchCriteria from '../components/CurrentSearchCriteria';
import Link from 'next/link';

interface Referral {
  id: number;
  title: string;
  description: string;
  cityId: number;
  company: string;
  companyId: number;
  countryId: number;
  currencyId: number;
  designation: string | null;
  designationId: number;
  salary: number;
  active: boolean;
  postedBy: number;
  createdAt: string;
  updatedAt: string;
  openingCount?: number;
  minExperience?: number;
  maxExperience?: number;
  openings?: number;
}

interface LocationOption {
  id: number;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  cityId: number;
  country: string;
  countryId: number;
  displayName: string;
  locationDisplay: string;
  remote: boolean;
  state: string;
  zipCode: string;
}

interface SearchRequest {
  page: number;
  size: number;
  keywords?: string[];
  keywordId?: string;
  countryId?: number;
  cityId?: number;
  minExperience?: number;
  maxExperience?: number;
}

async function fetchLocations(): Promise<{ [key: number]: LocationOption }> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/dropdowns/locations`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    const data: LocationOption[] = await response.json();
    return data.reduce((acc, location) => {
      acc[location.cityId] = location;
      return acc;
    }, {} as { [key: number]: LocationOption });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return {};
  }
}

async function fetchReferrals(page: number = 0, searchFilters: {
  keyword: string;
  keywordId: string;
  countryId: string;
  cityId: string;
  experience: string;
} = {
  keyword: '',
  keywordId: '',
  countryId: '',
  cityId: '',
  experience: ''
}): Promise<{
  referrals: Referral[];
  totalPages: number;
  totalElements: number;
}> {
  try {
    // Prepare request body for POST API
    const requestBody: SearchRequest = {
      page: page,
      size: 10
    };

    // Add search filters if they exist
    if (searchFilters.keywordId) requestBody.keywordId = searchFilters.keywordId;
    if (searchFilters.keyword) requestBody.keywords = [searchFilters.keyword];
    if (searchFilters.countryId) requestBody.countryId = parseInt(searchFilters.countryId);
    if (searchFilters.cityId) requestBody.cityId = parseInt(searchFilters.cityId);
    if (searchFilters.experience) {
      const experienceValue = parseInt(searchFilters.experience);
      requestBody.minExperience = experienceValue;
      requestBody.maxExperience = experienceValue;
    }

    const response = await fetch(`${BASE_URL}/api/v1/jobsearch/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referrals');
    }

    const data = await response.json();

    // Handle different response structures
    const referralsData = data.jobs || data.content || data.data || data || [];
    const totalPagesData = data.totalPages || data.total || 0;
    const totalElementsData = data.totalElements || data.totalCount || data.total || (totalPagesData * 10);

    return {
      referrals: Array.isArray(referralsData) ? referralsData : [],
      totalPages: totalPagesData,
      totalElements: totalElementsData
    };
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return {
      referrals: [],
      totalPages: 0,
      totalElements: 0
    };
  }
}

export default async function ReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 0;
  const searchFilters = {
    keyword: typeof resolvedSearchParams.keyword === 'string' ? resolvedSearchParams.keyword : '',
    keywordId: typeof resolvedSearchParams.keywordId === 'string' ? resolvedSearchParams.keywordId : '',
    countryId: typeof resolvedSearchParams.countryId === 'string' ? resolvedSearchParams.countryId : '',
    cityId: typeof resolvedSearchParams.cityId === 'string' ? resolvedSearchParams.cityId : '',
    experience: typeof resolvedSearchParams.experience === 'string' ? resolvedSearchParams.experience : ''
  };

  // Fetch data on the server
  const [locations, referralsData] = await Promise.all([
    fetchLocations(),
    fetchReferrals(page, searchFilters)
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4">
        {/* Current Search Criteria */}
        <CurrentSearchCriteria totalCount={referralsData.totalElements} />

        {/* Referral Listings SSR */}
        {referralsData.referrals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No referrals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {referralsData.referrals.map((referral) => (
              <JobTuple
                key={referral.id}
                id={referral.id}
                title={referral.title}
                description={referral.description}
                company={referral.company}
                cityId={referral.cityId}
                minExperience={referral.minExperience}
                maxExperience={referral.maxExperience}
                openingCount={referral.openingCount}
                createdAt={referral.createdAt}
                locations={locations}
                applicationStatus={<Suspense fallback={null}><ReferralStatusBadge jobId={referral.id} /></Suspense>}
              />
            ))}
          </div>
        )}

        {/* Pagination SSR */}
        {referralsData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Link
                href={`?${new URLSearchParams({ ...searchFilters, page: String(Math.max(0, page - 1)) }).toString()}`}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                aria-disabled={page === 0}
              >
                Previous
              </Link>
              {Array.from({ length: referralsData.totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`?${new URLSearchParams({ ...searchFilters, page: String(i) }).toString()}`}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === i
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
              <Link
                href={`?${new URLSearchParams({ ...searchFilters, page: String(Math.min(referralsData.totalPages - 1, page + 1)) }).toString()}`}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === referralsData.totalPages - 1 ? 'opacity-50 pointer-events-none' : ''}`}
                aria-disabled={page === referralsData.totalPages - 1}
              >
                Next
              </Link>
            </nav>
          </div>
        )}
      </div>
      <FloatingFilterButton />
    </main>
  );
}