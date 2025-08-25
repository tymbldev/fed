'use client';

import React from 'react';

export default function ReferralDetailsSkeleton() {
  return (
    <div className="bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200 p-4 md:p-8 animate-pulse">
      <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        ))}
      </div>
      <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-10/12 mb-6"></div>
      <div className="sticky bottom-[0px] h-[72px] py-2 border-t border-gray-200 bg-white/95">
        <div className="mx-auto max-w-4xl h-full">
          <div className="w-full h-full rounded-lg bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}


