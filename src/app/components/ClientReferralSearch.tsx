'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReferralSearch from './ReferralSearch';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  // keywordId: string;
  // countryId: string;
  country: string;
  // cityId: string;
  city: string;
  experience: string;
}

interface ClientReferralSearchProps {
  onSearch?: (searchData: SearchFormData) => void;
  initialValues?: SearchFormData;
}

export default function ClientReferralSearch({ onSearch, initialValues: propInitialValues }: ClientReferralSearchProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [initialValues, setInitialValues] = useState<SearchFormData>({
    keyword: propInitialValues?.keyword || searchParams.get('keyword') || '',
    // keywordId: propInitialValues?.keywordId || searchParams.get('keywordId') || '',
    // countryId: propInitialValues?.countryId || searchParams.get('countryId') || '',
    country: propInitialValues?.country || searchParams.get('country') || '',
    // cityId: propInitialValues?.cityId || searchParams.get('cityId') || '',
    city: propInitialValues?.city || searchParams.get('city') || '',
    experience: propInitialValues?.experience || searchParams.get('experience') || ''
  });

  useEffect(() => {
    // Read URL parameters on component mount
    const searchData: SearchFormData = {
      keyword: propInitialValues?.keyword || searchParams.get('keyword') || '',
      // keywordId: propInitialValues?.keywordId || searchParams.get('keywordId') || '',
      // countryId: propInitialValues?.countryId || searchParams.get('countryId') || '',
      country: propInitialValues?.country || searchParams.get('country') || '',
      // cityId: propInitialValues?.cityId || searchParams.get('cityId') || '',
      city: propInitialValues?.city || searchParams.get('city') || '',
      experience: propInitialValues?.experience || searchParams.get('experience') || ''
    };
    setInitialValues(searchData);
  }, [searchParams, propInitialValues]);

  const handleSearch = (searchData: SearchFormData) => {
    // If onSearch prop is provided (for modal), use it
    if (onSearch) {
      onSearch(searchData);
      return;
    }

    // Default behavior - update URL
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
  };

  return <ReferralSearch onSearch={handleSearch} initialValues={initialValues} />;
}