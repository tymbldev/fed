'use client';

import NProgress from 'nprogress';

// Configure NProgress for manual control
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  trickle: true,
  trickleSpeed: 200,
});

// Manual control functions
export const startLoading = () => {
  NProgress.start();
};

export const setProgress = (progress: number) => {
  NProgress.set(progress);
};

export const increment = (amount: number = 0.1) => {
  NProgress.inc(amount);
};

export const completeLoading = () => {
  NProgress.done();
};

export const removeLoading = () => {
  NProgress.remove();
};

// Helper function to simulate loading with progress
export const simulateLoading = (duration: number = 2000) => {
  startLoading();

  const interval = setInterval(() => {
    increment(0.1);
  }, duration / 10);

  setTimeout(() => {
    clearInterval(interval);
    completeLoading();
  }, duration);
};

// Hook for manual control (if needed)
export const useNavigationLoader = () => {
  return {
    startLoading,
    setProgress,
    increment,
    completeLoading,
    removeLoading,
    simulateLoading,
  };
};
