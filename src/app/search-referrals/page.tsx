'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReferralSearch from '../components/search/ReferralSearch';
import type { SearchFormData } from '../components/search/types';
import { fetchDropdownOptions } from '../services/api';
import { buildSeoPath } from '../utils/seo';
import { LocationOption } from '../types/common';



export default function SearchReferralsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const isEditFlow = (searchParams.get('edit') || '').toLowerCase() === 'true';

  const [initialValues, setInitialValues] = useState<SearchFormData>({
    keyword: searchParams.get('keyword') || '',
    country: searchParams.get('country') || '',
    city: searchParams.get('city') || '',
    experience: searchParams.get('experience') || '',
    location: ''
  });

  // Load location data for name-to-ID conversion
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        setIsLoadingLocation(true);
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
        setLocationData(data);
      } catch (err) {
        console.error('Failed to fetch location data:', err);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    loadLocationData();
  }, []);

  // Convert display names to IDs when location data is loaded
  useEffect(() => {
    if (locationData.length === 0 || isLoadingLocation) return;

    const searchData: SearchFormData = {
      keyword: searchParams.get('keyword') || '',
      country: searchParams.get('country') || '',
      city: searchParams.get('city') || '',
      experience: searchParams.get('experience') || '',
      location: ''
    };
    setInitialValues(searchData);
  }, [searchParams, locationData, isLoadingLocation]);

  useEffect(() => {
    // Update initial values when search params change (without location data dependency)
    if (isLoadingLocation) return;

    const searchData: SearchFormData = {
      keyword: searchParams.get('keyword') || '',
      country: searchParams.get('country') || '',
      city: searchParams.get('city') || '',
      experience: searchParams.get('experience') || '',
      location: ''
    };
    setInitialValues(searchData);
  }, [searchParams, locationData, isLoadingLocation]);

  const handleSearch = (searchData: SearchFormData) => {
    const pathname = buildSeoPath({
      keyword: searchData.keyword || '',
      country: searchData.country || '',
      city: searchData.city || '',
      experience: searchData.experience || ''
    });

    const params = new URLSearchParams();
    // params.set('page', '0');
    if (searchData.experience) params.set('experience', searchData.experience);

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Referrals</h1>
          {/* <p className="text-gray-600">Find your next career opportunity</p> */}
        </div>

        {/* Search Form */}
        <ReferralSearch
          onSearch={handleSearch}
          initialValues={isEditFlow ? initialValues : undefined}
          isLoading={isLoadingLocation}
        />
      </div>
    </div>
  );
}