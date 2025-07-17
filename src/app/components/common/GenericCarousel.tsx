"use client";

import React, { useState, useRef, useEffect } from 'react';

interface GenericCarouselProps {
  children: React.ReactNode;
  title?: string;
  viewAllLink?: {
    href: string;
    text: string;
  };
  className?: string;
  itemWidth?: number;
  gap?: number;
  showNavigation?: boolean;
}

const GenericCarousel: React.FC<GenericCarouselProps> = ({
  children,
  title,
  viewAllLink,
  className = '',
  itemWidth = 320,
  gap = 24,
  showNavigation = true
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = itemWidth + gap;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={`py-10 pb-6 bg-white dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        {(title || viewAllLink) && (
          <div className="flex justify-between mb-6">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {viewAllLink && (
              <a
                href={viewAllLink.href}
                className="text-[#5B4EFF] font-semibold hover:underline text-lg whitespace-nowrap"
              >
                {viewAllLink.text}
              </a>
            )}
          </div>
        )}
        <div className="relative">
          {showNavigation && canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 shadow-lg rounded-full items-center justify-center hover:scale-110 transition-transform duration-200"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto hide-scrollbar"
          >
            <div
              className="flex transition-transform duration-300 ease-in-out gap-8"
            >
              {children}
            </div>
          </div>
          {showNavigation && canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 shadow-lg rounded-full items-center justify-center hover:scale-110 transition-transform duration-200"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default GenericCarousel;