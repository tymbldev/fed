'use client';

import { useSearchModal } from '../context/SearchModalContext';
import Link from 'next/link';

interface ExploreOpportunitiesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ExploreOpportunitiesButton({ className = '', children }: ExploreOpportunitiesButtonProps) {
  const { openSearchModal } = useSearchModal();

  const handleDesktopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openSearchModal();
  };

  return (
    <>
      {/* Desktop: Button that opens modal */}
      <button
        onClick={handleDesktopClick}
        className={`hidden md:flex ${className}`}
      >
        {children}
      </button>

      {/* Mobile: Link that navigates to search page */}
      <Link
        href="/search-referrals"
        className={`md:hidden ${className}`}
      >
        {children}
      </Link>
    </>
  );
}