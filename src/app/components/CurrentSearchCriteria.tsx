'use client';

import { useSearchParams } from 'next/navigation';
import { useSearchModal } from '../context/SearchModalContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../services/api';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  keywordId: string;
  countryId: string;
  cityId: string;
  experience: string;
}

interface CurrentSearchCriteriaProps {
  totalCount?: number;
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

interface DesignationOption {
  id: number;
  name: string;
  description?: string;
}

export default function CurrentSearchCriteria({ totalCount = 0 }: CurrentSearchCriteriaProps) {
  const searchParams = useSearchParams();
  const { openSearchModal } = useSearchModal();

  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [designations, setDesignations] = useState<{ [key: number]: DesignationOption }>({});
  const [isLoading, setIsLoading] = useState(true);

  const currentSearch: SearchFormData = {
    keyword: searchParams.get('keyword') || '',
    keywordId: searchParams.get('keywordId') || '',
    countryId: searchParams.get('countryId') || '',
    cityId: searchParams.get('cityId') || '',
    experience: searchParams.get('experience') || ''
  };

  // Fetch location and designation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch locations
        const locationsResponse = await fetch(`${BASE_URL}/api/v1/dropdowns/locations`);
        if (locationsResponse.ok) {
          const locationsData: LocationOption[] = await locationsResponse.json();
          const locationsMap = locationsData.reduce((acc, location) => {
            acc[location.cityId] = location;
            return acc;
          }, {} as { [key: number]: LocationOption });
          setLocations(locationsMap);
        }

        // Fetch designations
        const designationsResponse = await fetch(`${BASE_URL}/api/v1/dropdowns/designations`);
        if (designationsResponse.ok) {
          const designationsData: DesignationOption[] = await designationsResponse.json();
          const designationsMap = designationsData.reduce((acc, designation) => {
            acc[designation.id] = designation;
            return acc;
          }, {} as { [key: number]: DesignationOption });
          setDesignations(designationsMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if there are any active search filters
  const hasActiveFilters = Object.values(currentSearch).some(value => value !== '');

  if (!hasActiveFilters) {
    return null;
  }

  const getSearchSummary = () => {
    const parts = [];

    // Add "Showing" prefix
    parts.push('Showing');

    // Add total count from API
    const formattedCount = totalCount.toLocaleString();
    parts.push(formattedCount);

    // Add keyword/designation
    if (currentSearch.keyword) {
      parts.push(currentSearch.keyword);
    } else if (currentSearch.keywordId && designations[parseInt(currentSearch.keywordId)]) {
      parts.push(designations[parseInt(currentSearch.keywordId)].name);
    } else {
      parts.push('Jobs');
    }

    // Add "jobs" after keyword
    parts.push('jobs');

    // Add location
    if (currentSearch.cityId && locations[parseInt(currentSearch.cityId)]) {
      const location = locations[parseInt(currentSearch.cityId)];
      parts.push(`in ${location.city}, ${location.country}`);
    } else if (currentSearch.countryId) {
      // Find country name from locations data
      const countryLocation = Object.values(locations).find(loc => loc.countryId === parseInt(currentSearch.countryId));
      if (countryLocation) {
        parts.push(`in ${countryLocation.country}`);
      } else {
        parts.push('in UAE');
      }
    }

    return parts.join(' ');
  };

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-blue-900 mb-1">{getSearchSummary()}</h1>
        </div>
        <div className="flex space-x-2">
          {/* Desktop: Edit button opens modal */}
          <button
            onClick={() => openSearchModal(currentSearch)}
            className="hidden md:flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          {/* Mobile: Edit button navigates to search page */}
          <Link
            href={`/search-referrals?${searchParams.toString()}`}
            className="md:hidden flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}