'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Enhanced NProgress configuration
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 800,
  trickle: true,
  trickleSpeed: 200,
  barSelector: '[role="bar"]',
  parent: 'body',
  template: '<div class="bar" role="bar"><div class="peg"></div></div>',
});

export default function GlobalNavigationLoader() {
  const pathname = usePathname();
  const isNavigating = useRef(false);

  useEffect(() => {
    // Only complete NProgress if it was started by a link click
    if (isNavigating.current) {
      // Complete the progress bar when route changes
      NProgress.done();
      isNavigating.current = false;
    }
  }, [pathname]);

  // Handle page unload and load events
  // useEffect(() => {
  //   const handleStart = () => {
  //     // Only start if not already navigating
  //     if (!isNavigating.current) {
  //       NProgress.start();
  //       setTimeout(() => NProgress.done(), 100);
  //     }
  //   };

  //   const handleComplete = () => {
  //     NProgress.done();
  //     isNavigating.current = false;
  //   };

  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('beforeunload', handleStart);
  //     window.addEventListener('load', handleComplete);

  //     // Handle browser back/forward buttons
  //     window.addEventListener('popstate', () => {
  //       if (!isNavigating.current) {
  //         NProgress.start();
  //         setTimeout(() => NProgress.done(), 300);
  //       }
  //     });
  //   }

  //   return () => {
  //     if (typeof window !== 'undefined') {
  //       window.removeEventListener('beforeunload', handleStart);
  //       window.removeEventListener('load', handleComplete);
  //       window.removeEventListener('popstate', () => {});
  //     }
  //   };
  // }, []);

  // Handle immediate progress bar on link clicks
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a, [role="link"]') as HTMLAnchorElement;

      if (link && (
        link.classList.contains('nprogress-trigger') ||
        link.classList.contains('show-progress') ||
        link.hasAttribute('data-nprogress')
      )) {
        // Check if Ctrl/Cmd key is pressed (opening in new tab)
        const isOpeningInNewTab = event.ctrlKey || event.metaKey;

        // Don't start progress if opening in new tab
        if (isOpeningInNewTab) {
          return;
        }

        // Mark as navigating and start progress
        isNavigating.current = true;
        NProgress.start();

        // Set initial progress to show it's working
        setTimeout(() => {
          if (isNavigating.current) {
            NProgress.set(0.4);
          }
        }, 150);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleLinkClick, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', handleLinkClick, true);
      }
    };
  }, []);

  return null; // NProgress handles the UI
}
