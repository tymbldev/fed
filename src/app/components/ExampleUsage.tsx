'use client';

import ProgressLink from './ProgressLink';
import Link from 'next/link';

// Example of how to use NProgress in your existing components
export default function ExampleUsage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Navigation Links</h3>
        <div className="flex gap-3">
          {/* Method 1: ProgressLink Component (Recommended) */}
          <ProgressLink
            href="/about-us"
            className="btn btn-primary"
          >
            About Us
          </ProgressLink>

          {/* Method 2: CSS Class */}
          <Link
            href="/contact-us"
            className="btn btn-secondary nprogress-trigger"
          >
            Contact
          </Link>

          {/* Method 3: Data Attribute */}
          <Link
            href="/faqs"
            className="btn btn-outline"
            data-nprogress="true"
          >
            FAQs
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Header Navigation</h3>
        <nav className="flex gap-4">
          <ProgressLink href="/" className="nav-link">
            Home
          </ProgressLink>
          <ProgressLink href="/referrals" className="nav-link">
            Referrals
          </ProgressLink>
          <ProgressLink href="/profile" className="nav-link">
            Profile
          </ProgressLink>
        </nav>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Footer Links</h3>
        <div className="flex gap-4 text-sm">
          <Link href="/privacy" className="text-gray-600 hover:text-gray-800 nprogress-trigger">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-gray-800 nprogress-trigger">
            Terms of Service
          </Link>
          <Link href="/support" className="text-gray-600 hover:text-gray-800 nprogress-trigger">
            Support
          </Link>
        </div>
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
          ✅ Implementation Complete!
        </h4>
        <p className="text-sm text-green-700 dark:text-green-300">
          The progress bar will now start immediately when users click on any link with the
          <code className="bg-green-100 dark:bg-green-800 px-1 rounded mx-1">nprogress-trigger</code>
          class, <code className="bg-green-100 dark:bg-green-800 px-1 rounded mx-1">data-nprogress=&quot;true&quot;</code>
          attribute, or using the <code className="bg-green-100 dark:bg-green-800 px-1 rounded mx-1">ProgressLink</code> component.
        </p>
      </div>
    </div>
  );
}
