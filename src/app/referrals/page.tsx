'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

interface Referrer {
  userId: number;
  userName: string;
  designation: string;
  numApplicationsAccepted: number;
  feedbackScore: number;
  overallScore: number;
}

export default function Referrals() {
  console.log('Referrals page loaded');
  const { isLoggedIn } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [appliedReferrals, setAppliedReferrals] = useState<{ [key: number]: Application }>({});
  const [postedReferrals, setPostedReferrals] = useState<{ [key: number]: PostedReferral }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [referrerCounts, setReferrerCounts] = useState<{ [key: number]: number }>({});

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



  const fetchReferrerCounts = async (referralIds: number[]) => {
    try {
      const promises = referralIds.map(async (referralId) => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/jobsearch/${referralId}/referrers`);
          if (response.ok) {
            const data: Referrer[] = await response.json();
            return { referralId, count: data.length };
          }
          return { referralId, count: 0 };
        } catch (error) {
          console.error(`Error fetching referrer count for referral ${referralId}:`, error);
          return { referralId, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      const countMap = results.reduce((acc, { referralId, count }) => {
        acc[referralId] = count;
        return acc;
      }, {} as { [key: number]: number });

      setReferrerCounts(countMap);
    } catch (error) {
      console.error('Error fetching referrer counts:', error);
    }
  };

  useEffect(() => {
    const fetchReferrals = async (page: number) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/api/v1/jobsearch?page=${page}&size=10`);
        if (!response.ok) {
          throw new Error('Failed to fetch referrals');
        }
        const data = await response.json();
        setReferrals(data.content);
        setTotalPages(data.totalPages);

        // Fetch referrer counts for the referrals
        if (data.content.length > 0) {
          const referralIds = data.content.map((referral: Referral) => referral.id);
          await fetchReferrerCounts(referralIds);
        }
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
        setAppliedReferrals(appliedReferralsMap);
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
      setAppliedReferrals({});
      setPostedReferrals({});
    }
  }, [currentPage, isLoggedIn]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLocationDisplay = (referral: Referral) => {
    const location = locations[referral.cityId];
    if (!location) return 'Location not specified';
    return `${location.city}, ${location.country}`;
  };

  const isReferralApplied = (jobId: number) => {
    const isApplied = appliedReferrals[jobId] !== undefined;
    console.log(`Checking referral ${jobId}:`, {
      isApplied,
      appliedReferralsKeys: Object.keys(appliedReferrals),
      appliedReferralsValue: appliedReferrals[jobId]
    });
    return isApplied;
  };

  const getApplicationStatus = (jobId: number) => {
    const application = appliedReferrals[jobId];
    return application ? application.status : null;
  };

  const isReferralPostedByUser = (jobId: number) => {
    return postedReferrals[jobId] !== undefined;
  };

  // Filter out referrals that are posted by the current user
  const filteredReferrals = referrals.filter(referral => !isReferralPostedByUser(referral.id));

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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            >
              <option value="">All Experience Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
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
              <div key={referral.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{referral.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{referral.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{getLocationDisplay(referral)}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <Link href={`/referrals/${referral.id}`} className="px-6 py-2 rounded-lg transition duration-200 bg-[#1a73e8] text-white hover:text-white hover:bg-[#1a73e8]/90">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Posted {formatDate(referral.createdAt)}</span>
                  {referrerCounts[referral.id] > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {referrerCounts[referral.id]} Referrer{referrerCounts[referral.id] > 1 ? 's' : ''} Available
                    </span>
                  )}
                  {isReferralApplied(referral.id) && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Applied - {getApplicationStatus(referral.id)}
                    </span>
                  )}
                </div>
              </div>
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