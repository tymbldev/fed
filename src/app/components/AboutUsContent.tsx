'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AboutUsContent() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About TymblHub</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-8">
          Welcome to TymblHub, your trusted partner in professional career growth and job search.
          We are dedicated to connecting talented professionals with outstanding career opportunities
          across various industries through our innovative referral-based platform.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Our mission is to revolutionize the way professionals find their dream jobs by leveraging
            the power of referrals and creating meaningful connections between job seekers and employers.
            We believe that personal connections and trusted referrals lead to better job matches and
            more successful career outcomes.
          </p>
        </section>

        {isLoggedIn && (
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <p className="text-green-800 font-medium">
              Welcome back! You&apos;re logged in and can access all our features.
            </p>
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Why Choose TymblHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Exclusive Job Opportunities</h3>
                  <p className="text-gray-600">Access to exclusive job opportunities from top companies that may not be advertised elsewhere.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Powerful Referral System</h3>
                  <p className="text-gray-600">Our referral system increases your chances of getting hired by connecting you with employees at target companies.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Network Building</h3>
                  <p className="text-gray-600">Build and expand your professional network with industry leaders and potential employers.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-3 mt-1 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Dedicated Support Team</h3>
                  <p className="text-gray-600">Our dedicated support team assists you throughout your job search journey with personalized guidance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}