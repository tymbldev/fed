'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReferralSearch from '../components/ReferralSearch';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  keywordId: string;
  countryId: string;
  cityId: string;
  experience: string;
}

export default function SearchReferralsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [initialValues, setInitialValues] = useState<SearchFormData>({
    keyword: searchParams.get('keyword') || '',
    keywordId: searchParams.get('keywordId') || '',
    countryId: searchParams.get('countryId') || '',
    cityId: searchParams.get('cityId') || '',
    experience: searchParams.get('experience') || ''
  });

  useEffect(() => {
    // Update initial values when search params change
    const searchData: SearchFormData = {
      keyword: searchParams.get('keyword') || '',
      keywordId: searchParams.get('keywordId') || '',
      countryId: searchParams.get('countryId') || '',
      cityId: searchParams.get('cityId') || '',
      experience: searchParams.get('experience') || ''
    };
    setInitialValues(searchData);
  }, [searchParams]);

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

    // Navigate to referrals page with search parameters
    router.push(`/referrals?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Referrals</h1>
          <p className="text-gray-600">Find your next career opportunity</p>
        </div>

        {/* Search Form */}
        <ReferralSearch
          onSearch={handleSearch}
          initialValues={initialValues}
        />
      </div>
    </div>
  );
}