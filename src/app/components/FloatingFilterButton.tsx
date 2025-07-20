'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function FloatingFilterButton() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Navigate to search page for mobile
  const handleMobileSearch = () => {
    router.push(`/search-referrals?${searchParams.toString()}`);
  };

  return (
    <>
      {/* Floating Search Button - Only visible on mobile */}
      <button
        onClick={handleMobileSearch}
        className="fixed bottom-32 right-4 z-40 md:hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        aria-label="Open search"
      >
        {/* Search Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </>
  );
}