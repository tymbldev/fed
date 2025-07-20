'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReferralSearch from './ReferralSearch';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  keywordId: string;
  countryId: string;
  cityId: string;
  experience: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: SearchFormData;
}

export default function GlobalSearchModal({ isOpen, onClose, initialValues }: GlobalSearchModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentSearchData, setCurrentSearchData] = useState<SearchFormData>({
    keyword: initialValues?.keyword || searchParams.get('keyword') || '',
    keywordId: initialValues?.keywordId || searchParams.get('keywordId') || '',
    countryId: initialValues?.countryId || searchParams.get('countryId') || '',
    cityId: initialValues?.cityId || searchParams.get('cityId') || '',
    experience: initialValues?.experience || searchParams.get('experience') || ''
  });

  useEffect(() => {
    // Update current search data when initialValues change
    if (initialValues) {
      setCurrentSearchData(initialValues);
    }
  }, [initialValues]);

  const handleSearch = (searchData: SearchFormData) => {
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

    // Update URL and navigate to referrals page
    router.push(`/referrals?${params.toString()}`);

    // Close the modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50">
        <div className="bg-white h-full w-full flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">
                  Search Jobs
                </h2>
                <p className="text-gray-600 text-lg">
                  Tell us your search criteria to get the most relevant jobs.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 flex p-8 md:pt-32">
            <div className="container mx-auto px-4">
              <ReferralSearch
                onSearch={handleSearch}
                initialValues={currentSearchData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}