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



  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-bold text-blue-900 mb-1">
              <span className="hidden md:inline">Showing </span>
              {totalCount.toLocaleString()}
              {currentSearch.keyword ? ` ${currentSearch.keyword}` : ' Jobs'} jobs
              {currentSearch.city && currentSearch.country ? ` in ${currentSearch.city}, ${currentSearch.country}` : currentSearch.country ? ` in ${currentSearch.country}` : ''}
            </h1>

            {/* Desktop: Edit button opens modal */}
            <button
              onClick={() => openSearchModal(currentSearch)}
              className="hidden md:flex items-center p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
              title="Edit search criteria"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Mobile: Edit button navigates to search page */}
            <Link
              href={`/search-referrals?${(() => {
                const p = new URLSearchParams(searchParams.toString());
                // Ensure derived values are present if not in URL params
                if (!p.get('keyword') && (derivedSearch?.keyword || '')) p.set('keyword', derivedSearch?.keyword || '');
                if (!p.get('country') && (derivedSearch?.country || '')) p.set('country', derivedSearch?.country || '');
                if (!p.get('city') && (derivedSearch?.city || '')) p.set('city', derivedSearch?.city || '');
                if (!p.get('experience') && (derivedSearch?.experience || '')) p.set('experience', derivedSearch?.experience || '');
                // Mark as edit flow
                p.set('edit','true');
                return p.toString();
              })()}`}
              className="md:hidden flex items-center p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
              title="Edit search criteria"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


