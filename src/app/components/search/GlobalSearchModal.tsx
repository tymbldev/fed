'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ReferralSearch from './ReferralSearch';
import { buildSeoPath } from '../../utils/seo';
import type { SearchFormData } from './types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: SearchFormData;
}

export default function GlobalSearchModal({ isOpen, onClose, initialValues }: GlobalSearchModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  // Only read URL parameters if we're on a search results page
  const isSearchResultsPage = pathname === '/referrals' || pathname === '/search-referrals';

  const [currentSearchData, setCurrentSearchData] = useState<SearchFormData>({
    keyword: '',
    country: '',
    city: '',
    experience: '',
    location: ''
  });

  // Handle initial values and URL parameters when modal opens or values change
  useEffect(() => {
    if (initialValues) {
      // If explicit initial values are provided, use them
      setCurrentSearchData({ ...initialValues, location: initialValues.location || '' });
    } else if (isSearchResultsPage) {
      // Only read from URL params if we're on a search results page
      setCurrentSearchData({
        keyword: searchParams.get('keyword') || '',
        country: searchParams.get('country') || '',
        city: searchParams.get('city') || '',
        experience: searchParams.get('experience') || '',
        location: ''
      });
    } else {
      // Reset to empty defaults if not on search results page
      setCurrentSearchData({
        keyword: '',
        country: '',
        city: '',
        experience: '',
        location: ''
      });
    }
  }, [initialValues, isSearchResultsPage, searchParams]);

  // Reset search data when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // When modal opens, ensure we have the correct data based on current context
      if (initialValues) {
        setCurrentSearchData({ ...initialValues, location: initialValues.location || '' });
      } else if (isSearchResultsPage) {
        setCurrentSearchData({
          keyword: searchParams.get('keyword') || '',
          country: searchParams.get('country') || '',
          city: searchParams.get('city') || '',
          experience: searchParams.get('experience') || '',
          location: ''
        });
      } else {
        setCurrentSearchData({
          keyword: '',
          country: '',
          city: '',
          experience: '',
          location: ''
        });
      }
    }
  }, [isOpen, initialValues, isSearchResultsPage, searchParams]);

  // Reset loading state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setNavigationInProgress(false);
      setAnimateIn(false);
      setTargetHref(null);
    }
  }, [isOpen]);

  // Trigger enter animation on mount/open (desktop only styles applied via classes)
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  const handleSearch = (searchData: SearchFormData) => {
    setIsLoading(true);
    setNavigationInProgress(true);

    try {
      const nextPath = buildSeoPath({
        keyword: searchData.keyword || '',
        country: searchData.country || '',
        city: searchData.city || '',
        experience: searchData.experience || ''
      });

      const params = new URLSearchParams();
      if (searchData.experience) params.set('experience', searchData.experience);

      const qs = params.toString();
      const href = qs ? `${nextPath}?${qs}` : nextPath;
      setTargetHref(href);
      console.log('pushing to new SRP', href);
      router.push(href);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
      setNavigationInProgress(false);
      setTargetHref(null);
    }
  };

  // Close the modal after the router has navigated to the intended URL
  useEffect(() => {
    if (!navigationInProgress || !targetHref) return;

    const currentQs = searchParams.toString();
    const currentHref = currentQs ? `${pathname}?${currentQs}` : pathname;

    if (currentHref === targetHref) {
      // Give the new page a frame to paint before closing the modal
      const id = requestAnimationFrame(() => {
        setIsLoading(false);
        setNavigationInProgress(false);
        setTargetHref(null);
        onClose();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [pathname, searchParams, navigationInProgress, targetHref, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={isLoading || navigationInProgress ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50">
        <div
          className={
            `bg-white h-full w-full flex flex-col ` +
            `md:transform md:transition-transform md:duration-500 md:ease-out ` +
            (animateIn ? `md:translate-y-0` : `md:-translate-y-full`)
          }
        >
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
                onClick={isLoading || navigationInProgress ? undefined : onClose}
                className={`p-3 rounded-full transition-colors ${
                  isLoading || navigationInProgress
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                aria-label="Close search"
                disabled={isLoading || navigationInProgress}
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
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


