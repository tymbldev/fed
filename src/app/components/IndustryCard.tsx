"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Company {
  companyId: number;
  companyName: string;
  logoUrl: string;
  website: string;
  headquarters: string;
  activeJobCount: number;
}

interface IndustryCardProps {
  industry: {
    industryId: number;
    industryName: string;
    industryDescription: string;
    companyCount: number;
    topCompanies: Company[];
  };
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
  const topCompanies = industry.topCompanies.slice(0, 3);
  const emptySlots = 3 - topCompanies.length;

  return (
    <div
      className="block bg-white dark:bg-gray-50 rounded-[20px] shadow-lg w-full min-w-[220px] max-w-full sm:min-w-[300px] sm:max-w-[220px] flex-shrink-0 p-6 flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl h-[200px] hover:scale-105 transition-transform"
    >
      <div className="flex-1">
        <Link href={`/industries/${industry.industryId}`} className="flex items-center justify-between mb-2">
          <div>
            <div className="text-l font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight min-h-[48px]">
              {industry.industryName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
              {industry.companyCount}+ vacancies
            </div>
          </div>
          <div className="ml-2 text-primary-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <div className="flex gap-3 mt-4 min-h-[56px] items-center">
          {topCompanies.map((company) => (
            <Link
              key={company.companyId}
              href={`/companies/${company.companyId}`}
              className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-900 rounded-lg shadow p-2 hover:scale-105 transition-transform z-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.companyName}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              ) : (
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {company.companyName}
                </span>
              )}
            </Link>
          ))}
          {Array.from({ length: emptySlots }).map((_, idx) => (
            <div key={idx} className="w-12 h-12 bg-white dark:bg-gray-900 rounded-lg" />
          ))}
          {industry.topCompanies.length > 3 && (
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-xs font-bold">
              +{industry.topCompanies.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryCard;