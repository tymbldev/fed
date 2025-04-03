'use client';

import React from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1a73e8] to-[#34c759] text-transparent bg-clip-text">
            Reset Password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#1a73e8] to-[#34c759] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8]"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link href="/login" className="font-medium text-[#1a73e8] hover:text-[#1a73e8]/80">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
} 