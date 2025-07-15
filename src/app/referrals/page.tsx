'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReferralSearch from '../components/ReferralSearch';
import JobTuple from '../components/JobTuple';

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

interface Application {
  id: number;
  jobId: number;
  referralTitle: string;
  applicantId: number;
  applicantName: string;
  status: string;
  createdAt: string;
}

interface PostedReferral {
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



export default function Referrals() {
  const { isLoggedIn } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [postedReferrals, setPostedReferrals] = useState<{ [key: number]: PostedReferral }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    keywordId: '',
    countryId: '',
    cityId: '',
    experience: ''
  });
  const fetchLocations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data: LocationOption[] = await response.json();
      const locationMap = data.reduce((acc, location) => {
        acc[location.cityId] = location;
        return acc;
      }, {} as { [key: number]: LocationOption });
      setLocations(locationMap);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
    }
  };





  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn);
    const fetchReferrals = async (page: number) => {
      try {
        setIsLoading(true);

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
          body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
          throw new Error('Failed to fetch referrals');
        }
                const data = await response.json();
        console.log('API Response:', data);
        console.log('Response type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        console.log('Has content property?', data && typeof data === 'object' && 'content' in data);

        // Handle different response structures
        const referralsData = data.jobs || data.content || data.data || data || [];
        const totalPagesData = data.totalPages || data.total || 0;

        console.log('Processed referralsData:', referralsData);
        console.log('Processed totalPagesData:', totalPagesData);
        console.log('Final referrals array:', Array.isArray(referralsData) ? referralsData : []);

        setReferrals(Array.isArray(referralsData) ? referralsData : []);
        setTotalPages(totalPagesData);
      } catch (error) {
        toast.error('Failed to fetch referrals');
        console.error('Error fetching referrals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAppliedReferrals = async () => {
      if (!isLoggedIn) {
        return; // Don't fetch if user is not logged in
      }

      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (!token) {
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/my-applications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applied referrals');
        }

        const data = await response.json();
        console.log('Raw API response:', data);
        console.log('Response type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        console.log('Has content property?', data && typeof data === 'object' && 'content' in data);

        // Handle both array and object with content property
        const applicationsArray: Application[] = Array.isArray(data) ? data : (data.content || []);
        console.log('Applications array:', applicationsArray);
        console.log('Array length:', applicationsArray.length);

        const appliedReferralsMap = applicationsArray.reduce((acc: { [key: number]: Application }, application: Application) => {
          console.log('Processing application:', application);
          console.log('Application jobId:', application.jobId, 'Type:', typeof application.jobId);
          acc[application.jobId] = application;
          return acc;
        }, {} as { [key: number]: Application });

        console.log('Final appliedReferralsMap:', appliedReferralsMap);
        console.log('Map keys:', Object.keys(appliedReferralsMap));
        // setAppliedReferrals(appliedReferralsMap); // This line is removed as per the edit hint
      } catch (error) {
        console.error('Error fetching applied referrals:', error);
        // Don't show error toast for this as it might be expected for non-logged in users
      }
    };

    const fetchPostedReferrals = async () => {
      if (!isLoggedIn) {
        return; // Don't fetch if user is not logged in
      }

      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (!token) {
          console.log('No auth token found for posted referrals fetch');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/jobmanagement/my-posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posted referrals');
        }

        const data = await response.json();
        const postedReferralsMap = data.content.reduce((acc: { [key: number]: PostedReferral }, referral: PostedReferral) => {
          acc[referral.id] = referral;
          return acc;
        }, {} as { [key: number]: PostedReferral });
        setPostedReferrals(postedReferralsMap);
      } catch (error) {
        console.error('Error fetching posted referrals:', error);
        // Don't show error toast for this as it might be expected for non-logged in users
      }
    };

    fetchLocations();
    fetchReferrals(currentPage);

    if (isLoggedIn) {
      fetchAppliedReferrals();
      fetchPostedReferrals();
    } else {
      // Clear the state when user is not logged in
      // setAppliedReferrals({}); // This line is removed as per the edit hint
      setPostedReferrals({});
    }
  }, [currentPage, isLoggedIn, searchFilters]);



  const isReferralPostedByUser = (jobId: number) => {
    const isPosted = postedReferrals[jobId] !== undefined;
    console.log(`isReferralPostedByUser(${jobId}): ${isPosted}, postedReferrals keys:`, Object.keys(postedReferrals));
    return isPosted;
  };

  const handleSearch = (searchData: {
    keyword: string;
    keywordId: string;
    countryId: string;
    cityId: string;
    experience: string;
  }) => {
    setSearchFilters(searchData);
    setCurrentPage(0); // Reset to first page when searching
  };

  // Filter out referrals that are posted by the current user
  console.log('Current referrals state:', referrals);
  console.log('Current postedReferrals state:', postedReferrals);
  console.log('Is logged in:', isLoggedIn);

    // Filter out referrals that are posted by the current user
  const filteredReferrals = (referrals || []).filter(referral => {
    const isPostedByUser = isReferralPostedByUser(referral.id);
    console.log(`Referral ${referral.id} - isPostedByUser: ${isPostedByUser}`);
    return !isPostedByUser;
  });

  console.log('Filtered referrals:', filteredReferrals);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#1a73e8] to-[#34c759] text-transparent bg-clip-text">
            Referral Listings
          </h1>
          <p className="text-gray-600">Find your next career opportunity</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <ReferralSearch onSearch={handleSearch} />
          {!isLoggedIn && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                💡 <Link href="/login" className="underline font-medium">Log in</Link> to see your application status for referrals you&apos;ve applied to.
              </p>
            </div>
          )}
        </div>

        {/* Referral Listings */}
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No referrals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReferrals.map((referral) => (
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
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}