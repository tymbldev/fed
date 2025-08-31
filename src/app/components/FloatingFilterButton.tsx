'use client';

"use client";

import { useSearchParams, useRouter } from 'next/navigation';

interface FloatingFilterButtonProps {
  keyword?: string;
  country?: string;
  city?: string;
  experience?: string;
}

export default function FloatingFilterButton({ keyword, country, city, experience }: FloatingFilterButtonProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleMobileSearch = () => {
    const params = new URLSearchParams();

    // Prefer explicit props from listing; fallback to current URL params
    const getParam = (key: string, provided?: string) => {
      const value = (provided ?? '').trim();
      if (value) return value;
      const fromUrl = (searchParams.get(key) || '').trim();
      return fromUrl;
    };

    const nextKeyword = getParam('keyword', keyword);
    const nextCountry = getParam('country', country);
    const nextCity = getParam('city', city);
    const nextExperience = getParam('experience', experience);

    if (nextKeyword) params.set('keyword', nextKeyword);
    if (nextCountry) params.set('country', nextCountry);
    if (nextCity) params.set('city', nextCity);
    if (nextExperience) params.set('experience', nextExperience);

    params.set('edit', 'true');
    router.push(`/search-referrals?${params.toString()}`);
  };

  return (
    <>
      {/* Floating Search Button - Only visible on mobile */}
      <button
        onClick={handleMobileSearch}
        className="fixed bottom-32 right-4 z-40 md:hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        aria-label="Edit search"
        title="Edit search"
      >
        {/* Edit Search Icon (magnifier + pencil) */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {/* Magnifying glass (Heroicons outline) */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          {/* Pencil badge at bottom-right */}
          <g transform="translate(9 9) scale(0.6)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.121 2.121 0 10-3-3L5 17v3z" />
          </g>
        </svg>
      </button>
    </>
  );
}