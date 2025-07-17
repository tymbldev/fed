'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handlePostReferral = () => {
    if (isLoggedIn) {
      router.push('/post-referral');
    } else {
      router.push('/login?redirect=/post-referral');
    }
  };

  const handleProfile = () => {
    if (isLoggedIn) {
      router.push('/profile');
    } else {
      router.push('/login?redirect=/profile');
    }
  };

  const navItems = isLoggedIn ? [
    {
      href: '/my-referrals',
      label: 'My Referrals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      href: '/referrals',
      label: 'Referrals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      action: handlePostReferral,
      label: 'Post Referral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      action: handleProfile,
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      href: '/industries',
      label: 'Companies',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ] : [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: '/referrals',
      label: 'Referrals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      action: handlePostReferral,
      label: 'Post Referral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      action: handleProfile,
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      href: '/industries',
      label: 'Companies',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50" />

      {/* Navigation container */}
      <div className="relative flex items-center justify-around px-4 py-2">
        {navItems.map((item, index) => {
          // Determine if the item is active based on href or current pathname
          let isActive = false;
          if (item.href) {
            isActive = pathname === item.href;
          } else {
            // For action items, check if we're on the target page
            if (item.label === 'Post Referral') {
              isActive = pathname === '/post-referral';
            } else if (item.label === 'Profile') {
              isActive = pathname === '/profile';
            }
          }

          if (item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
              >
                {/* Icon container with background */}
                <div className={`relative p-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50'
                }`}>
                  <div className={`transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {item.icon}
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          } else {
            return (
              <button
                key={index}
                onClick={item.action}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
              >
                {/* Icon container with background */}
                <div className={`relative p-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 group-hover:shadow-lg group-hover:shadow-blue-500/25'
                }`}>
                  <div className={`transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {item.icon}
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }
        })}
      </div>

      {/* Bottom safe area for devices with home indicator */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent" />
    </nav>
  );
}