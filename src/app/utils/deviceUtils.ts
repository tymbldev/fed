/**
 * Device detection utilities
 */

/**
 * Check if the current device is mobile based on screen width
 * @returns boolean - true if mobile (width <= 768px), false otherwise
 */
export const isMobile = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth <= 768;
};

/**
 * Check if the current device is tablet based on screen width
 * @returns boolean - true if tablet (width > 768px and <= 1024px), false otherwise
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

/**
 * Check if the current device is desktop based on screen width
 * @returns boolean - true if desktop (width > 1024px), false otherwise
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth > 1024;
};

/**
 * Get the current screen width
 * @returns number - screen width in pixels, or 0 if not in browser
 */
export const getScreenWidth = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  return window.innerWidth;
};

/**
 * Add a resize event listener to detect device changes
 * @param callback - function to call when screen size changes
 * @returns function - cleanup function to remove the listener
 */
export const addResizeListener = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('resize', callback);

  return () => {
    window.removeEventListener('resize', callback);
  };
};