"use client";

import React, { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { slugify } from '../utils/seo';
import { isMobile } from '../utils/deviceUtils';

type TopSkill = {
  skillName: string;
  jobCount: number;
};

interface TopSkillsShowcaseProps {
  skills: TopSkill[];
}

function formatJobs(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
  return `${count}`;
}

const SkillBadge: React.FC<{ skill: TopSkill; index: number }> = ({ skill, index }) => {
  const href = `/${slugify(skill.skillName)}-jobs`;

  // Create a rotating color scheme for visual variety
  const colorSchemes = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-teal-500 to-green-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500',
  ];

  const colorScheme = colorSchemes[index % colorSchemes.length];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorScheme} p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 nprogress-trigger`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border border-white rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white">
        <div className="text-lg font-bold mb-2 truncate">
          {skill.skillName}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-90">
            {formatJobs(skill.jobCount)} jobs
          </span>
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};

const TopSkillsShowcase: React.FC<TopSkillsShowcaseProps> = ({ skills }) => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobileDevice ? 6 : 9; // Mobile: 6 items (2x3), Desktop: 9 items (3x3)
  const maxItems = isMobileDevice ? 18 : skills.length; // Mobile: limit to 18 items
  const displaySkills = skills.slice(0, maxItems);

  const pages = useMemo(() => {
    const chunks: TopSkill[][] = [];
    for (let i = 0; i < displaySkills.length; i += itemsPerPage) {
      chunks.push(displaySkills.slice(i, i + itemsPerPage));
    }
    return chunks.length ? chunks : [[]];
  }, [displaySkills, itemsPerPage]);

  const [pageIndex, setPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pages.length - 1;

  const goPrev = () => {
    if (canPrev && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setPageIndex(pageIndex - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goNext = () => {
    if (canNext && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setPageIndex(pageIndex + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Swipe handling for mobile
  const swipeStateRef = useRef<{ startX: number; startY: number; active: boolean }>({ startX: 0, startY: 0, active: false });

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStateRef.current = { startX: e.clientX, startY: e.clientY, active: true };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!swipeStateRef.current.active) return;
    const dx = Math.abs(e.clientX - swipeStateRef.current.startX);
    const dy = Math.abs(e.clientY - swipeStateRef.current.startY);
    if (dx > 10 && dy < 20) {
      e.preventDefault();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!swipeStateRef.current.active || isAnimating) return;
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

  if (!skills || skills.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4">
        {/* Main container with different styling */}
        <div className="rounded-[32px] border border-blue-200/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 md:p-6 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
            {/* Left promo area with different design */}
            <div className="lg:col-span-1 flex items-center">
              <div className="text-center lg:text-left">
                <div className="hidden sm:block relative mb-6">
                  {/* Different icon design */}
                  <div className="w-20 h-20 mx-auto lg:mx-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                  Master in-demand
                  <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    skills
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Explore trending skills and find opportunities that match your expertise
                </p>
              </div>
            </div>

            {/* Right skills grid panel */}
            <div
              className="relative overflow-visible lg:col-span-2 touch-pan-y select-none"
              onPointerDown={pages.length > 1 ? onPointerDown : undefined}
              onPointerMove={pages.length > 1 ? onPointerMove : undefined}
              onPointerUp={pages.length > 1 ? onPointerUp : undefined}
              onPointerCancel={pages.length > 1 ? onPointerUp : undefined}
            >
              <div className="rounded-3xl bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-slate-700/90 dark:to-slate-600/50 border border-blue-200/30 dark:border-slate-600/30 shadow-lg p-4 md:p-6 min-h-[320px] overflow-hidden relative">
                {/* Simple sliding container with 3x width */}
                                     <div className="flex transition-transform duration-300 ease-in-out"
                     style={{
                       width: `calc(${pages.length * 100}%)`,
                       transform: `translateX(calc(-${pageIndex * (100 / pages.length)}% - ${pageIndex * 24}px))`
                     }}
                   >
                                       {pages.map((page, pageIdx) => (
                      <div key={pageIdx} className={`flex-shrink-0 ${pageIdx < pages.length - 1 ? 'mr-6' : ''}`} style={{ width: `${100 / pages.length}%` }}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 h-full">
                         {page.map((skill, index) => (
                           <SkillBadge key={`${pageIdx}-${skill.skillName}`} skill={skill} index={index} />
                         ))}
                         {Array.from({ length: Math.max(0, itemsPerPage - page.length) }).map((_, idx) => (
                           <div key={`empty-${pageIdx}-${idx}`} className="hidden sm:block" />
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>

                {/* Different pagination dots */}
                {pages.length > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-8">
                    {pages.map((_, i) => (
                                          <button
                      key={i}
                                             onClick={() => {
                         if (!isAnimating && i !== pageIndex) {
                           setIsAnimating(true);
                           setTimeout(() => {
                             setPageIndex(i);
                             setIsAnimating(false);
                           }, 300);
                         }
                       }}
                      disabled={isAnimating}
                      aria-label={`Go to page ${i + 1}`}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        pageIndex === i
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 w-8 shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600 w-3 hover:bg-gray-400 dark:hover:bg-gray-500'
                      } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation arrows with different styling */}
              {pages.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={!canPrev || isAnimating}
                    className={`hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-2xl items-center justify-center shadow-xl border border-blue-200/30 dark:border-slate-600/30 backdrop-blur bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-200 hover:scale-110 transition-all duration-300 ${
                      canPrev && !isAnimating ? 'hover:shadow-2xl' : 'opacity-40 cursor-not-allowed'
                    }`}
                    aria-label="Previous skills"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canNext || isAnimating}
                    className={`hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-2xl items-center justify-center shadow-xl border border-blue-200/30 dark:border-slate-600/30 backdrop-blur bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-200 hover:scale-110 transition-all duration-300 ${
                      canNext && !isAnimating ? 'hover:shadow-2xl' : 'opacity-40 cursor-not-allowed'
                    }`}
                    aria-label="Next skills"
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

export default TopSkillsShowcase;
