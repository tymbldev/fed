'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BASE_URL } from '../services/api';
import ReferralSearch from '../components/ReferralSearch';

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
  applicationCount?: number;
  userRole: string;
}

export default function MyReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
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

  const fetchApplicationCounts = async (referralIds: number[]) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const promises = referralIds.map(async (referralId) => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/job-applications/job/${referralId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            return { referralId, count: data.length || 0 };
          }
          return { referralId, count: 0 };
        } catch (error) {
          console.error(`Error fetching application count for referral ${referralId}:`, error);
          return { referralId, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      const countMap = results.reduce((acc, { referralId, count }) => {
        acc[referralId] = count;
        return acc;
      }, {} as { [key: number]: number });

      setReferrals(prevReferrals =>
        prevReferrals.map(referral => ({
          ...referral,
          applicationCount: countMap[referral.id] || 0
        }))
      );
    } catch (error) {
      console.error('Error fetching application counts:', error);
    }
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

  const fetchReferrals = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: '10'
      });

      // Add search filters if they exist
      if (searchFilters.keywordId) params.append('designationId', searchFilters.keywordId);
      if (searchFilters.countryId) params.append('countryId', searchFilters.countryId);
      if (searchFilters.cityId) params.append('cityId', searchFilters.cityId);
      if (searchFilters.experience) params.append('experience', searchFilters.experience);

      const response = await fetch(`${BASE_URL}/api/v1/jobmanagement/my-posts?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }
      const data = await response.json();
      setReferrals(data.content);
      setTotalPages(data.totalPages);

      // Fetch application counts for the referrals
      if (data.content.length > 0) {
        const referralIds = data.content.map((referral: Referral) => referral.id);
        await fetchApplicationCounts(referralIds);
      }
    } catch (error) {
      toast.error('Failed to fetch referrals');
      console.error('Error fetching referrals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchFilters]);

  useEffect(() => {
    fetchReferrals(currentPage);
  }, [currentPage, fetchReferrals]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);

    const getDayWithOrdinal = (d: number) => {
      if (d > 3 && d < 21) return `${d}th`;
      switch (d % 10) {
        case 1:  return `${d}st`;
        case 2:  return `${d}nd`;
        case 3:  return `${d}rd`;
        default: return `${d}th`;
      }
    };

    return `${getDayWithOrdinal(day)} ${month} ${year}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posted Referrals</h1>
        <Link
          href="/post-referral"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Post a New Referral
        </Link>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <ReferralSearch onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven&apos;t posted any referrals yet.</p>
          <Link
            href="/post-referral"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            Post your first referral
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden">
            <ul>
              {referrals.map((referral) => (
                <li key={referral.id}>
                  <div className="p-4 border border-gray-200 rounded-lg mb-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          <Link href={`/my-referrals/${referral.id}`} className="hover:underline">
                            {referral.title}
                          </Link>
                        </h2>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>Company: {referral.company}</span>
                          <span className="mx-2">|</span>
                          <span>Posted by: me on {formatDate(referral.createdAt)}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                          <Link href={`/my-referrals/${referral.id}`} className="hover:underline">
                            <span className="text-sm font-semibold text-gray-700">
                              {referral.applicationCount || 0} Total Responses
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {referral.userRole === 'POSTER' && (
                          <Link
                            href={`/post-referral?edit=true&id=${referral.id}`}
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                          >
                            Edit Referral
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
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
        </>
      )}
    </div>
  );
}