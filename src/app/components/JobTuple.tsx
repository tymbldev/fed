import Link from 'next/link';
import { LocationOption } from '../utils/serverData';
import React from 'react';

interface JobTupleProps {
  id: number;
  title: string;
  description: string;
  company: string;
  companyId?: number;
  cityId: number;
  minExperience?: number;
  maxExperience?: number;
  openingCount?: number;
  createdAt: string;
  locations?: { [key: number]: LocationOption };
  applicationStatus?: React.ReactNode;
  cityName?: string;
  countryName?: string;
}

export default function JobTuple({
  id,
  title,
  description,
  company,
  companyId,
  cityId,
  minExperience,
  maxExperience,
  openingCount,
  createdAt,
  locations,
  applicationStatus,
  cityName,
  countryName
}: JobTupleProps) {
  // console.log('companyId', companyId);
  // Utility to strip HTML tags from a string - consistent between server and client
  function stripHtml(html: string): string {
    if (!html) return '';
    // Use a simple regex approach that works consistently on both server and client
    return html.replace(/<[^>]*>/g, '');
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const getLocationDisplay = (cityId: number) => {
    // If we have cityName and countryName directly, use them
    if (cityName && countryName) {
      return `${cityName}, ${countryName}`;
    }

    // Otherwise, fall back to locations lookup
    if (locations) {
      const location = locations[cityId];
      if (location) {
        return `${location.city}, ${location.country}`;
      }
    }

    return 'Location not specified';
  };

  return (
    <div className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-200 flex flex-col justify-between h-full">
        {/* Header: Title & Company */}
        <div>
          <h3 className="text-xl font-semibold mb-1">
            <Link href={`/referrals/${id}`} className="hover:underline">{title}</Link>
          </h3>
          {companyId ? (
            <Link href={`/companies/${companyId}`} className="text-blue-900 font-medium text-base mb-2 hover:underline">{company}</Link>
          ) : (
            <div className="text-blue-900 font-medium text-base mb-2">{company}</div>
          )}
        </div>
        {/* Meta: Experience & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-2 sm:gap-6 gap-2">
          <div className="flex items-center">
            {/* Briefcase Icon for Experience */}
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" strokeWidth="2" stroke="currentColor" fill="none" />
            </svg>
            <span>
              {minExperience} - {maxExperience} Years
            </span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.25 10.5c0 5.385-4.865 10.09-7.2 12.034a1.5 1.5 0 01-1.8 0C7.95 20.59 3.75 15.885 3.75 10.5a8.25 8.25 0 1116.5 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
            </svg>
            <span>{getLocationDisplay(cityId)}</span>
          </div>
        </div>
        {/* Description */}
        <div className="hidden sm:block">
          <div className="text-gray-700 text-sm mb-3 line-clamp-2">
            {stripHtml(description)}
          </div>
        </div>
        {/* Badges & Date */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-2">
            {openingCount && openingCount > 1 && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Multiple Vacancies</span>
            )}
            {applicationStatus}
            {/* Add more badges as needed */}
          </div>
          <div className="text-gray-400 text-xs">{formatDateShort(createdAt)}</div>
        </div>
      </div>
    </div>
  );
}