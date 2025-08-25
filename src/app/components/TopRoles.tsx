"use client";

import React from 'react';
import Link from 'next/link';
import GenericCarousel from './common/GenericCarousel';
import { slugify } from '../utils/seo';

interface TopRole {
  designationName: string;
  jobCount: number;
}

interface TopRolesProps {
  roles: TopRole[];
  totalJobs?: number;
}

const RoleCard: React.FC<{ role: TopRole }> = ({ role }) => {
  const slug = slugify(role.designationName);
  const href = `/${slug}-jobs`;

  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-50 rounded-2xl shadow-lg w-full min-w-[220px] max-w-full sm:min-w-[260px] sm:max-w-[220px] flex-shrink-0 p-6 transition-all duration-300 hover:shadow-xl group h-[160px] hover:-translate-y-1 hover:scale-[1.02] nprogress-trigger"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 line-clamp-2 pr-3">
          {role.designationName}
        </h3>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-200 dark:text-primary-800 text-sm font-bold shadow">
          {role.jobCount}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-700">
        {role.jobCount} job{role.jobCount === 1 ? '' : 's'}
      </p>
      <div className="mt-6 text-primary-600 font-semibold flex items-center gap-1">
        Explore
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

const TopRoles: React.FC<TopRolesProps> = ({ roles }) => {
  if (!roles || roles.length === 0) {
    return null;
  }

  return (
    <GenericCarousel
      title="Jobs by Top Roles"
      viewAllLink={{ href: '/referrals', text: 'View All Jobs' }}
      itemWidth={280}
    >
      {roles.map((role) => (
        <div key={role.designationName} className="pb-4 bg-transparent">
          <RoleCard role={role} />
        </div>
      ))}
    </GenericCarousel>
  );
};

export default TopRoles;


