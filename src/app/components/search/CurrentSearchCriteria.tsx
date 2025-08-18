'use client';

import { useSearchParams } from 'next/navigation';
import { useSearchModal } from '../../context/SearchModalContext';
import Link from 'next/link';
import type { SearchFormData } from './types';

interface CurrentSearchCriteriaProps {
  totalCount?: number;
  derivedSearch?: {
    keyword: string;
    country: string;
    city: string;
    experience: string;
  };
}

export default function CurrentSearchCriteria({ totalCount = 0, derivedSearch }: CurrentSearchCriteriaProps) {
  const searchParams = useSearchParams();
  const { openSearchModal } = useSearchModal();

  const currentSearch: SearchFormData = {
    keyword: searchParams.get('keyword') || derivedSearch?.keyword || '',
    keywordId: '', // No longer reading from URL since we don't push IDs
    country: searchParams.get('country') || derivedSearch?.country || '',
    city: searchParams.get('city') || derivedSearch?.city || '',
    experience: searchParams.get('experience') || derivedSearch?.experience || '',
    location: ''
  };

  // Check if there are any active search filters
  const hasActiveFilters = Object.values(currentSearch).some(value => value !== '');

  if (!hasActiveFilters) {
    return null;
  }

  // Show content immediately, only show loading for total count
  const getSearchSummary = () => {
    const parts = [] as string[];

    // Add "Showing" prefix
    parts.push('Showing');

    // Add total count from API
    const formattedCount = totalCount.toLocaleString();
    parts.push(formattedCount);

    // Add keyword/designation
    if (currentSearch.keyword) {
      parts.push(currentSearch.keyword);
    } else {
      parts.push('Jobs');
    }

    // Add "jobs" after keyword
    parts.push('jobs');

    // Add location from URL parameters
    if (currentSearch.city && currentSearch.country) {
      parts.push(`in ${currentSearch.city}, ${currentSearch.country}`);
    } else if (currentSearch.country) {
      parts.push(`in ${currentSearch.country}`);
    }

    return parts.join(' ');
  };

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
            href={`/search-referrals?${(() => { const p = new URLSearchParams(searchParams.toString()); p.set('edit','true'); return p.toString(); })()}`}
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


