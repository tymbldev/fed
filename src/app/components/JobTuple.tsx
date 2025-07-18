import Link from 'next/link';
import { LocationOption } from '../utils/serverData';
import React from 'react';

interface JobTupleProps {
  id: number;
  title: string;
  description: string;
  company: string;
  cityId: number;
  minExperience?: number;
  maxExperience?: number;
  openingCount?: number;
  createdAt: string;
  locations: { [key: number]: LocationOption };
  applicationStatus?: React.ReactNode;
}

export default function JobTuple({
  id,
  title,
  description,
  company,
  cityId,
  minExperience,
  maxExperience,
  openingCount,
  createdAt,
  locations,
  applicationStatus
}: JobTupleProps) {
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
    const location = locations[cityId];
    if (!location) return 'Location not specified';
    return `${location.city}, ${location.country}`;
  };

  return (
    <Link href={`/referrals/${id}`} className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-full">
        {/* Header: Title & Company */}
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <div className="text-blue-900 font-medium text-base mb-2">{company}</div>
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
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
    </Link>
  );
}