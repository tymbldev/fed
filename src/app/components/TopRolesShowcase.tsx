"use client";

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { slugify } from '../utils/seo';

type TopRole = {
  designationName: string;
  jobCount: number;
};

interface TopRolesShowcaseProps {
  roles: TopRole[];
}

function formatJobs(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M+ Jobs`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K+ Jobs`;
  return `${count} Jobs`;
}

const RoleTile: React.FC<{ role: TopRole }> = ({ role }) => {
  const href = `/${slugify(role.designationName)}-jobs`;
  return (
    <Link
      href={href}
      className="flex items-start justify-between gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 nprogress-trigger"
    >
      <div className="min-w-0">
        <div className="text-[15px] font-semibold text-gray-900 dark:text-white truncate">
          {role.designationName}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formatJobs(role.jobCount)}
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-400 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
};

const TopRolesShowcase: React.FC<TopRolesShowcaseProps> = ({ roles }) => {
  const itemsPerPage = 6; // 2 columns x 3 rows
  const pages = useMemo(() => {
    const chunks: TopRole[][] = [];
    for (let i = 0; i < roles.length; i += itemsPerPage) {
      chunks.push(roles.slice(i, i + itemsPerPage));
    }
    return chunks.length ? chunks : [[]];
  }, [roles]);

  const [pageIndex, setPageIndex] = useState(0);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pages.length - 1;

  const goPrev = () => canPrev && setPageIndex(pageIndex - 1);
  const goNext = () => canNext && setPageIndex(pageIndex + 1);

  // Swipe handling for mobile
  const swipeStateRef = useRef<{ startX: number; startY: number; active: boolean }>({ startX: 0, startY: 0, active: false });

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStateRef.current = { startX: e.clientX, startY: e.clientY, active: true };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!swipeStateRef.current.active) return;
    const dx = Math.abs(e.clientX - swipeStateRef.current.startX);
    const dy = Math.abs(e.clientY - swipeStateRef.current.startY);
    // If horizontal intent is clear, prevent vertical scroll interference
    if (dx > 10 && dy < 20) {
      e.preventDefault();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!swipeStateRef.current.active) return;
    const dx = e.clientX - swipeStateRef.current.startX;
    const dy = Math.abs(e.clientY - swipeStateRef.current.startY);
    swipeStateRef.current.active = false;
    if (Math.abs(dx) > 40 && dy < 40) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  if (!roles || roles.length === 0) return null;

  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Shared soft yellow background across the whole component */}
        <div className="rounded-[28px] border border-amber-100 dark:border-gray-700 bg-gradient-to-b from-amber-50 via-amber-50 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* Left promo area */}
            <div className="lg:col-span-2 flex items-center">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block relative">
                  <svg
                    className="w-24 h-24 drop-shadow-[0_8px_24px_rgba(26,115,232,0.25)]"
                    viewBox="0 0 96 96"
                    fill="none"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="trGrad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1a73e8" />
                        <stop offset="1" stopColor="#34c759" />
                      </linearGradient>
                      <radialGradient id="trGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 48) rotate(90) scale(48)">
                        <stop stopColor="#ffffff" stopOpacity="0.28" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <circle cx="48" cy="48" r="44" fill="url(#trGrad)" />
                    <circle cx="48" cy="48" r="44" fill="url(#trGlow)" />
                    <circle cx="48" cy="48" r="44" stroke="white" strokeOpacity="0.35" strokeWidth="2" />

                    <path d="M24 48a24 24 0 0 1 24-24" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
                    <path d="M72 48a24 24 0 0 1-24 24" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />

                    <g className="animate-pulse-slow">
                      <circle cx="44" cy="44" r="12" stroke="#fff" strokeWidth="3" />
                      <line x1="52" y1="52" x2="64" y2="64" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                    </g>

                    <circle cx="70" cy="26" r="2" fill="#fff" opacity="0.9" />
                    <circle cx="26" cy="70" r="1.6" fill="#fff" opacity="0.7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    Discover jobs across
                    <span className="block">popular roles</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                    Select a role and we&apos;ll show you relevant jobs for it
                  </p>
                </div>
              </div>
            </div>

            {/* Right carousel panel (2/4 width) */}
            <div
              className="relative overflow-visible lg:col-span-2 touch-pan-y select-none"
              onPointerDown={pages.length > 1 ? onPointerDown : undefined}
              onPointerMove={pages.length > 1 ? onPointerMove : undefined}
              onPointerUp={pages.length > 1 ? onPointerUp : undefined}
              onPointerCancel={pages.length > 1 ? onPointerUp : undefined}
            >
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm p-4 md:p-6 min-h-[260px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {pages[pageIndex].map((role) => (
                    <RoleTile key={role.designationName} role={role} />
                  ))}
                  {Array.from({ length: Math.max(0, itemsPerPage - pages[pageIndex].length) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="hidden sm:block" />
                  ))}
                </div>
                {/* Dots */}
                {pages.length > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-5">
                    {pages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPageIndex(i)}
                        aria-label={`Go to page ${i + 1}`}
                        className={`h-2.5 rounded-full transition-all ${
                          pageIndex === i ? 'bg-gray-900 dark:bg-white w-6' : 'bg-gray-300 dark:bg-gray-600 w-2.5'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Nav arrows */}
              {pages.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={!canPrev}
                    className={`hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center shadow-lg border backdrop-blur bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 ${
                      canPrev ? 'hover:scale-105' : 'opacity-40 cursor-not-allowed'
                    }`}
                    aria-label="Previous roles"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canNext}
                    className={`hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center shadow-lg border backdrop-blur bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 ${
                      canNext ? 'hover:scale-105' : 'opacity-40 cursor-not-allowed'
                    }`}
                    aria-label="Next roles"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRolesShowcase;


