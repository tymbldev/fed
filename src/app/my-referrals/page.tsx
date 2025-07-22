'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BASE_URL } from '../services/api';

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
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; referralId: number | null; referralTitle: string }>({
    show: false,
    referralId: null,
    referralTitle: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
  }, []);

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

  const handleDeleteReferral = async (referralId: number) => {
    try {
      setIsDeleting(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const response = await fetch(`${BASE_URL}/api/v1/jobmanagement/${referralId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete referral');
      }

      toast.success('Referral deleted successfully');

      // Remove the deleted referral from the list
      setReferrals(prevReferrals => prevReferrals.filter(referral => referral.id !== referralId));

      // Close the confirmation dialog
      setDeleteConfirmation({ show: false, referralId: null, referralTitle: '' });

      // If this was the last item on the current page and not the first page, go to previous page
      if (referrals.length === 1 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting referral:', error);
      toast.error('Failed to delete referral');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteConfirmation = (referralId: number, referralTitle: string) => {
    setDeleteConfirmation({ show: true, referralId, referralTitle });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, referralId: null, referralTitle: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posted Referrals</h1>
        <Link
          href="/post-referral"
          className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Post a New Referral
        </Link>
      </div>

      {/* Floating + button for mobile */}
      <Link
        href="/post-referral"
        className="md:hidden fixed bottom-32 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors duration-200"
        aria-label="Post a new referral"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

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
                      <div className="ml-4 flex-shrink-0 flex gap-2">
                        {referral.userRole === 'POSTER' && (
                          <>
                            <Link
                              href={`/post-referral?edit=true&id=${referral.id}`}
                              className="p-2 text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                              title="Edit referral"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => openDeleteConfirmation(referral.id, referral.title)}
                              className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                              disabled={isDeleting}
                              title="Delete referral"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Referral</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{deleteConfirmation.referralTitle}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmation.referralId && handleDeleteReferral(deleteConfirmation.referralId)}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}