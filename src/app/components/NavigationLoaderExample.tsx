'use client';

import { simulateLoading, startLoading, completeLoading, increment } from '../hooks/useNavigationLoader';
import NProgress from 'nprogress';
import ProgressLink from './ProgressLink';
import Link from 'next/link';

export default function NavigationLoaderExample() {
  const handleManualLoading = () => {
    simulateLoading(3000); // 3 seconds
  };

  const handleCustomLoading = () => {
    startLoading();

    // Simulate a custom loading process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      increment(0.1);

      if (progress >= 1) {
        clearInterval(interval);
        completeLoading();
      }
    }, 200);
  };

  const handleAPILoading = async () => {
    // Simulate API call with progress
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.set(0.3);
    }, 500);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      NProgress.done();
    } catch {
      NProgress.done();
    } finally {
      clearTimeout(timer);
    }
  };

  const handleFormSubmission = async () => {
    // Simulate form submission
    NProgress.start();
    NProgress.set(0.2);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      NProgress.set(0.8);
      setTimeout(() => NProgress.done(), 200);
    } catch {
      NProgress.done();
    }
  };

  const handleFileUpload = () => {
    // Simulate file upload with progress
    NProgress.start();
    NProgress.set(0.1);

    let progress = 0.1;
    const interval = setInterval(() => {
      progress += 0.1;
      NProgress.set(progress);

      if (progress >= 1) {
        clearInterval(interval);
        NProgress.done();
      }
    }, 300);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-6">NProgress Loader Examples</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Basic Controls</h4>

          <button
            onClick={handleManualLoading}
            className="btn btn-primary w-full"
          >
            Basic Loading (3s)
          </button>

          <button
            onClick={handleCustomLoading}
            className="btn btn-secondary w-full"
          >
            Custom Progress (2s)
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Advanced Patterns</h4>

          <button
            onClick={handleAPILoading}
            className="btn btn-primary w-full"
          >
            API Call with Progress
          </button>

          <button
            onClick={handleFormSubmission}
            className="btn btn-secondary w-full"
          >
            Form Submission
          </button>

          <button
            onClick={handleFileUpload}
            className="btn btn-outline w-full"
          >
            File Upload Progress
          </button>
        </div>
      </div>

      {/* Link Examples */}
      <div className="mt-8">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Link Progress Examples</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Method 1: ProgressLink Component</h5>
            <ProgressLink
              href="/about-us"
              className="btn btn-primary w-full"
            >
              About Us (ProgressLink)
            </ProgressLink>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Method 2: CSS Class</h5>
            <Link
              href="/contact-us"
              className="btn btn-secondary w-full nprogress-trigger"
            >
              Contact Us (CSS Class)
            </Link>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Method 3: Data Attribute</h5>
            <Link
              href="/faqs"
              className="btn btn-outline w-full"
              data-nprogress="true"
            >
              FAQs (Data Attribute)
            </Link>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">How to Use:</h5>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <p><strong>Option 1:</strong> Use <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">ProgressLink</code> component</p>
            <p><strong>Option 2:</strong> Add <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">nprogress-trigger</code> class</p>
            <p><strong>Option 3:</strong> Add <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">data-nprogress=&quot;true&quot;</code> attribute</p>
            <p><strong>Option 4:</strong> Add <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">show-progress</code> class</p>
            <p className="mt-2 text-xs"><strong>💡 Tip:</strong> Hold Ctrl/Cmd + Click to open links in new tabs without triggering the progress bar</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Automatic route change detection</li>
          <li>• Immediate progress on link clicks</li>
          <li>• Smart detection (skips progress for new tab opens)</li>
          <li>• Manual progress control</li>
          <li>• API call progress tracking</li>
          <li>• Form submission feedback</li>
          <li>• File upload progress</li>
          <li>• Dark mode support</li>
          <li>• Smooth animations</li>
        </ul>
      </div>
    </div>
  );
}
