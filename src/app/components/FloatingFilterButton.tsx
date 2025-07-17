'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ClientReferralSearch from './ClientReferralSearch';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  keywordId: string;
  countryId: string;
  cityId: string;
  experience: string;
}

export default function FloatingFilterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current search parameters
  const currentSearchData: SearchFormData = {
    keyword: searchParams.get('keyword') || '',
    keywordId: searchParams.get('keywordId') || '',
    countryId: searchParams.get('countryId') || '',
    cityId: searchParams.get('cityId') || '',
    experience: searchParams.get('experience') || ''
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle search from modal - this will update URL and close the modal
  const handleModalSearch = (searchData: SearchFormData) => {
    // Create new URLSearchParams with current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update with new search data
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 0 for new searches
    params.set('page', '0');
    // Update URL without page refresh
    router.push(`?${params.toString()}`, { scroll: false });

    // Close the modal with a small delay to ensure search completes
    setTimeout(() => {
      closeModal();
    }, 100);
  };

  return (
    <>
      {/* Floating Filter Button - Only visible on mobile */}
      <button
        onClick={openModal}
        className="fixed bottom-32 right-4 z-40 md:hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        aria-label="Open filters"
      >
        {/* Filter Icon (Funnel) */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.414a2 2 0 00-.586-1.414L2.293 6.707A1 1 0 012 6V4z"/>
        </svg>
      </button>

      {/* Filter Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 md:hidden p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md h-[70vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Filter Referrals
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close filters"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <ClientReferralSearch
                  onSearch={handleModalSearch}
                  initialValues={currentSearchData}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}