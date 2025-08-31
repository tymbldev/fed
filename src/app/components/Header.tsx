'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useSearchModal } from '../context/SearchModalContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { openSearchModal } = useSearchModal();

  // Define landing pages where hamburger is visible (else show back button)
  const landingPaths = new Set([
    '/',
    '/search-referrals',
    '/referrals',
    '/post-referral',
    '/profile',
    '/my-referrals',
    '/industries',
  ]);
  const isLandingPage = landingPaths.has(pathname);
  const isRegisterPage = pathname === '/register';

  // Footer links for mobile menu
  const footerLinks = {
    company: [
      { href: '/', label: 'Home' },
      { href: '/about-us', label: 'About Us' },
      { href: '/contact-us', label: 'Contact Us' },
      { href: '/feedback', label: 'Feedback' },
    ],
    legal: [
      { href: '/terms-conditions', label: 'Terms & Conditions' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/security-advice', label: 'Security Advice' },
    ],
    support: [
      { href: '/fraud', label: 'Fraud' },
      { href: '/report-bug', label: 'Report Bug' },
      { href: '/summons-notices', label: 'Summons/Notices' },
      { href: '/grievances', label: 'Grievances' },
      { href: '/faqs', label: 'FAQs' },
    ],
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll behavior on desktop (md breakpoint and above)
      if (window.innerWidth < 768) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Handle resize events to update behavior when screen size changes
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Clear the auth token cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const loggedOutNavItems = [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  const loggedInNavItems = [
    { href: '/profile', label: 'Profile' },
    { href: '/post-referral', label: 'Post a Referral' },
    { href: '/my-referrals', label: 'My Referrals' },
    // { href: '/refer', label: 'Refer' },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : loggedOutNavItems;

  return (
    <>
      <header className={`md:sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile: hamburger on landing pages; back button elsewhere. Hidden on register page */}
              {!isRegisterPage && (
                isLandingPage ? (
                  <button
                    onClick={toggleMenu}
                    className="menu-button md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => router.back()}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Go back"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )
              )}

              <Link href="/" className="text-2xl font-bold text-primary-500 dark:text-primary-400 nprogress-trigger">
              <Image
                src="/logo.svg"
                alt="TymblHub"
                width={180}
                height={50}
                className="h-8 md:h-12 w-auto"
                priority
              />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on register page */}
            {!isRegisterPage && (
              <div className="hidden md:flex items-center space-x-6">
                {/* Search Button */}
                <button
                  onClick={() => openSearchModal()}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors nprogress-trigger ${
                      pathname === item.href ? 'text-primary-500 dark:text-primary-400' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer - Only on landing pages */}
      {!isRegisterPage && isLandingPage && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
              isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`mobile-menu fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Content */}
            <div className="py-6 px-2 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              {/* Main Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block py-3 px-4 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all nprogress-trigger ${
                      pathname === item.href ? 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Logout
                  </button>
                )}

                {/* Company Links */}
                <div>
                  <button
                    onClick={() => toggleAccordion('company')}
                    className="w-full flex items-center justify-between p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    <span className="font-medium">Company</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform text-gray-500 ${
                        openAccordion === 'company' ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {openAccordion === 'company' && (
                    <div className="ml-8 mt-2 space-y-1">
                      {footerLinks.company.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 px-3 rounded text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors nprogress-trigger"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Legal Links */}
                <div>
                  <button
                    onClick={() => toggleAccordion('legal')}
                    className="w-full flex items-center justify-between p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    <span className="font-medium">Legal</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform text-gray-500 ${
                        openAccordion === 'legal' ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {openAccordion === 'legal' && (
                    <div className="ml-8 mt-2 space-y-1">
                      {footerLinks.legal.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 px-3 rounded text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors nprogress-trigger"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Support Links */}
                <div>
                  <button
                    onClick={() => toggleAccordion('support')}
                    className="w-full flex items-center justify-between p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    <span className="font-medium">Support</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform text-gray-500 ${
                        openAccordion === 'support' ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {openAccordion === 'support' && (
                    <div className="ml-8 mt-2 space-y-1">
                      {footerLinks.support.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 px-3 rounded text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors nprogress-trigger"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  © {new Date().getFullYear()} TymblHub. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}