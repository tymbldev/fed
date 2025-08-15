'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReferralSearch from '../components/ReferralSearch';
import { fetchDropdownOptions } from '../services/api';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  country: string;
  // countryId: string;
  city: string;
  // cityId: string;
  experience: string;
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

export default function SearchReferralsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const isEditFlow = (searchParams.get('edit') || '').toLowerCase() === 'true';

  const [initialValues, setInitialValues] = useState<SearchFormData>({
    keyword: searchParams.get('keyword') || '',
    country: searchParams.get('country') || '',
    // countryId: '',
    city: searchParams.get('city') || '',
    // cityId: '',
    experience: searchParams.get('experience') || ''
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

    // const countryName = searchParams.get('country');
    // const cityName = searchParams.get('city');

    // let countryId = '';
    // let cityId = '';

    // Find country ID from display name
    // if (countryName) {
    //   const countryLocation = locationData.find(loc =>
    //     loc.country && loc.country.toLowerCase() === countryName.toLowerCase()
    //   );
    //   if (countryLocation) {
    //     countryId = countryLocation.countryId.toString();
    //   }
    // }

    // Find city ID from display name (within the selected country if available)
    // if (cityName) {
    //   const cityLocation = locationData.find(loc =>
    //     loc.city && loc.city.toLowerCase() === cityName.toLowerCase() &&
    //     (!countryId || loc.countryId.toString() === countryId)
    //   );
    //   if (cityLocation) {
    //     cityId = cityLocation.cityId.toString();
    //   }
    // }

    // Update initial values with IDs
    const searchData: SearchFormData = {
      keyword: searchParams.get('keyword') || '',
      country: searchParams.get('country') || '',
      // countryId: countryId,
      city: searchParams.get('city') || '',
      // cityId: cityId,
      experience: searchParams.get('experience') || ''
    };
    setInitialValues(searchData);
  }, [searchParams, locationData, isLoadingLocation]);

  useEffect(() => {
    // Update initial values when search params change (without location data dependency)
    if (isLoadingLocation) return;

    // const countryName = searchParams.get('country');
    // const cityName = searchParams.get('city');

    // let countryId = '';
    // let cityId = '';

    // // Find country ID from display name
    // if (countryName && locationData.length > 0) {
    //   const countryLocation = locationData.find(loc =>
    //     loc.country && loc.country.toLowerCase() === countryName.toLowerCase()
    //   );
    //   if (countryLocation) {
    //     countryId = countryLocation.countryId.toString();
    //   }
    // }

    // Find city ID from display name (within the selected country if available)
    // if (cityName && locationData.length > 0) {
    //   const cityLocation = locationData.find(loc =>
    //     loc.city && loc.city.toLowerCase() === cityName.toLowerCase() &&
    //     (!countryId || loc.countryId.toString() === countryId)
    //   );
    //   if (cityLocation) {
    //     cityId = cityLocation.cityId.toString();
    //   }
    // }

    const searchData: SearchFormData = {
      keyword: searchParams.get('keyword') || '',
      country: searchParams.get('country') || '',
      // countryId: countryId,
      city: searchParams.get('city') || '',
      // cityId: cityId,
      experience: searchParams.get('experience') || ''
    };
    setInitialValues(searchData);
  }, [searchParams, locationData, isLoadingLocation]);

  const handleSearch = (searchData: SearchFormData) => {
    // Create new URLSearchParams with current search params
    const params = new URLSearchParams(searchParams.toString());

    // Only push display values to URL, not IDs
    if (searchData.keyword) {
      params.set('keyword', searchData.keyword);
    } else {
      params.delete('keyword');
    }

    if (searchData.country) {
      params.set('country', searchData.country);
    } else {
      params.delete('country');
    }

    if (searchData.city) {
      params.set('city', searchData.city);
    } else {
      params.delete('city');
    }

    if (searchData.experience) {
      params.set('experience', searchData.experience);
    } else {
      params.delete('experience');
    }

    // Remove ID fields from URL
    // params.delete('keywordId');
    // params.delete('countryId');
    // params.delete('cityId');

    // Reset to page 0 for new searches
    // params.set('page', '0');

    // Navigate to referrals page with search parameters
    router.push(`/referrals?${params.toString()}`);
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
          autoDefaultToIndia={!isEditFlow}
        />
      </div>
    </div>
  );
}