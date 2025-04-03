'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a73e8]/10 to-[#34c759]/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#1a73e8] to-[#34c759] text-transparent bg-clip-text">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with top companies and opportunities that match your skills and aspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="px-8 py-4 bg-gradient-to-r from-[#1a73e8] to-[#34c759] text-white rounded-lg hover:opacity-90 transition duration-200">
                Browse Jobs
              </Link>
              <Link href="/register" className="px-8 py-4 border-2 border-[#1a73e8] text-[#1a73e8] rounded-lg hover:bg-[#1a73e8] hover:text-white transition duration-200">
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TymblHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-[#1a73e8]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
              <p className="text-gray-600">Smart algorithms match you with the perfect job opportunities</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-[#34c759]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#34c759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Referral Network</h3>
              <p className="text-gray-600">Connect with professionals and get referred to top companies</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-[#1a73e8]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">Access resources and opportunities for professional development</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 