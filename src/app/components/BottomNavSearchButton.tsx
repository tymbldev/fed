'use client';

import { useSearchModal } from '../context/SearchModalContext';
import Link from 'next/link';

interface BottomNavSearchButtonProps {
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
}

export default function BottomNavSearchButton({ className = '', children, isActive = false }: BottomNavSearchButtonProps) {
  const { openSearchModal } = useSearchModal();

  const handleDesktopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openSearchModal();
  };

  const baseClasses = `group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
    isActive
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
  }`;

  const iconContainerClasses = `relative p-1 rounded-xl transition-all duration-300 ${
    isActive
      ? 'bg-blue-50 dark:bg-blue-900/20'
      : 'group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50'
  }`;

  const iconClasses = `transition-all duration-300 ${
    isActive ? 'scale-110' : 'group-hover:scale-105'
  }`;

  const labelClasses = `text-[10px] mt-1 font-medium transition-all duration-300 ${
    isActive
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
  }`;

  return (
    <>
      {/* Desktop: Button that opens modal */}
      <button
        onClick={handleDesktopClick}
        className={`hidden md:flex ${baseClasses} ${className}`}
      >
        <div className={iconContainerClasses}>
          <div className={iconClasses}>
            {children}
          </div>
        </div>
        <span className={labelClasses}>
          Search
        </span>
      </button>

      {/* Mobile: Link that navigates to search page */}
      <Link
        href="/search-referrals"
        className={`md:hidden ${baseClasses} ${className}`}
      >
        <div className={iconContainerClasses}>
          <div className={iconClasses}>
            {children}
          </div>
        </div>
        <span className={labelClasses}>
          Search
        </span>
      </Link>
    </>
  );
}