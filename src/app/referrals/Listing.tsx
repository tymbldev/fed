import { BASE_URL } from '../services/api';
import ReferralStatusBadge from './ReferralStatusBadge';
import FloatingFilterButton from '../components/FloatingFilterButton';
import JobTuple from '../components/JobTuple';
import CurrentSearchCriteria from '../components/search/CurrentSearchCriteria';
import { fetchLocations } from '../utils/serverData';
import { splitSeoSlug } from '../utils/seo';
import Link from 'next/link';
import { cookies } from 'next/headers';

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
  cityName: string;
  companyName: string;
  countryName: string;
  currencyName: string;
}

interface SearchRequest {
  page: number;
  size: number;
  keywords?: string[];
  keywordId?: string;
  countryName?: string;
  cityName?: string;
  minExperience?: number;
  maxExperience?: number;
}

async function fetchReferrals(page: number = 0, searchFilters: {
  keyword: string;
  country: string;
  city: string;
  experience: string;
} = {
  keyword: '',
  country: '',
  city: '',
  experience: ''
}): Promise<{
  referrals: Referral[];
  totalPages: number;
  totalElements: number;
}> {
  try {
    const requestBody: SearchRequest = {
      page: page,
      size: 10
    };

    if (searchFilters.keyword) requestBody.keywords = [searchFilters.keyword];
    if (searchFilters.country) requestBody.countryName = searchFilters.country;
    if (searchFilters.city) requestBody.cityName = searchFilters.city;
    if (searchFilters.experience) {
      const experienceValue = parseInt(searchFilters.experience);
      requestBody.minExperience = experienceValue;
      requestBody.maxExperience = experienceValue;
    }

    console.log('jobsearch/search', requestBody);

    const response = await fetch(`${BASE_URL}/api/v1/jobsearch/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });

    console.log(response);

    if (!response.ok) {
      throw new Error('Failed to fetch referrals');
    }

    const data = await response.json();

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

async function parseSeoSlug(seoSlug: string | undefined): Promise<{ keyword: string; city: string; country: string }> {
  if (!seoSlug) {
    return { keyword: '', city: '', country: '' };
  }

  const slug = seoSlug.toLowerCase();
  const { keyword: kw, location } = splitSeoSlug(slug);
  if (location) {
    const { city, country } = await resolveLocation(location);
    return { keyword: kw, city, country };
  }

  if (kw) return { keyword: kw, city: '', country: '' };

  return { keyword: '', city: '', country: '' };
}

async function resolveLocation(locationName: string): Promise<{ city: string; country: string }> {
  try {
    const locationsMap = await fetchLocations();
    const normalizedTarget = locationName.toLowerCase();

    for (const key of Object.keys(locationsMap)) {
      const loc = locationsMap[Number(key)];
      if (loc.city.toLowerCase() === normalizedTarget) {
        return { city: loc.city, country: '' };
      }
    }

    for (const key of Object.keys(locationsMap)) {
      const loc = locationsMap[Number(key)];
      if (loc.country.toLowerCase() === normalizedTarget) {
        return { city: '', country: loc.country };
      }
    }

    return { city: '', country: locationName };
  } catch {
    return { city: '', country: locationName };
  }
}

async function fetchMyApplicationsStatusMap(): Promise<Record<number, string>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return {};

    const response = await fetch(`${BASE_URL}/api/v1/my-applications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) return {};

    const data: Array<{ jobId: number; status: string }> = await response.json();
    const map: Record<number, string> = {};
    for (const row of data) {
      if (row && typeof row.jobId === 'number' && typeof row.status === 'string') {
        map[row.jobId] = row.status;
      }
    }
    return map;
  } catch {
    return {};
  }
}

export default async function ReferralsListing({
  searchParams,
  seoSlug: seoSlugOverride,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  seoSlug?: string;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 0;

  const seoSlug = typeof resolvedSearchParams.seo === 'string' ? resolvedSearchParams.seo : seoSlugOverride;
  const derivedFromSeo = await parseSeoSlug(seoSlug);

  const searchFilters = {
    keyword: typeof resolvedSearchParams.keyword === 'string' ? resolvedSearchParams.keyword : derivedFromSeo.keyword,
    country: typeof resolvedSearchParams.country === 'string' ? resolvedSearchParams.country : derivedFromSeo.country,
    city: typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : derivedFromSeo.city,
    experience: typeof resolvedSearchParams.experience === 'string' ? resolvedSearchParams.experience : ''
  };

  const [referralsData, applicationStatusMap] = await Promise.all([
    fetchReferrals(page, searchFilters),
    fetchMyApplicationsStatusMap(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <CurrentSearchCriteria totalCount={referralsData.totalElements} derivedSearch={searchFilters} />
        {referralsData.referrals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No referrals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {referralsData.referrals.map((referral: Referral) => (
              <JobTuple
                key={referral.id}
                id={referral.id}
                title={referral.title}
                description={referral.description}
                company={referral.company}
                companyId={referral.companyId || undefined}
                cityId={referral.cityId}
                minExperience={referral.minExperience}
                maxExperience={referral.maxExperience}
                openingCount={referral.openingCount}
                createdAt={referral.createdAt}
                cityName={referral.cityName}
                countryName={referral.countryName}
                applicationStatus={<ReferralStatusBadge status={applicationStatusMap[referral.id] || null} />}
              />
            ))}
          </div>
        )}

        {referralsData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {(() => {
                const baseHref = seoSlug ? `/${seoSlug}` : '/referrals';
                const buildHref = (p: number) => {
                  const params = new URLSearchParams();
                  if (!seoSlug) {
                    if (searchFilters.keyword) params.set('keyword', searchFilters.keyword);
                    if (searchFilters.country) params.set('country', searchFilters.country);
                    if (searchFilters.city) params.set('city', searchFilters.city);
                  }
                  if (searchFilters.experience) params.set('experience', searchFilters.experience);
                  params.set('page', String(p));
                  const qs = params.toString();
                  return qs ? `${baseHref}?${qs}` : baseHref;
                };
                return (
                  <Link
                    href={buildHref(Math.max(0, page - 1))}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                    aria-disabled={page === 0}
                  >
                    Previous
                  </Link>
                );
              })()}
              {Array.from({ length: referralsData.totalPages }, (_, i) => (
                (() => {
                  const baseHref = seoSlug ? `/${seoSlug}` : '/referrals';
                  const params = new URLSearchParams();
                  if (!seoSlug) {
                    if (searchFilters.keyword) params.set('keyword', searchFilters.keyword);
                    if (searchFilters.country) params.set('country', searchFilters.country);
                    if (searchFilters.city) params.set('city', searchFilters.city);
                  }
                  if (searchFilters.experience) params.set('experience', searchFilters.experience);
                  params.set('page', String(i));
                  const qs = params.toString();
                  const href = qs ? `${baseHref}?${qs}` : baseHref;
                  return (
                    <Link
                      key={i}
                      href={href}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === i
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </Link>
                  );
                })()
              ))}
              {(() => {
                const baseHref = seoSlug ? `/${seoSlug}` : '/referrals';
                const buildHref = (p: number) => {
                  const params = new URLSearchParams();
                  if (!seoSlug) {
                    if (searchFilters.keyword) params.set('keyword', searchFilters.keyword);
                    if (searchFilters.country) params.set('country', searchFilters.country);
                    if (searchFilters.city) params.set('city', searchFilters.city);
                  }
                  if (searchFilters.experience) params.set('experience', searchFilters.experience);
                  params.set('page', String(p));
                  const qs = params.toString();
                  return qs ? `${baseHref}?${qs}` : baseHref;
                };
                return (
                  <Link
                    href={buildHref(Math.min(referralsData.totalPages - 1, page + 1))}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === referralsData.totalPages - 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    aria-disabled={page === referralsData.totalPages - 1}
                  >
                    Next
                  </Link>
                );
              })()}
            </nav>
          </div>
        )}
      </div>
      <FloatingFilterButton />
    </main>
  );
}


