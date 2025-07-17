'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AuthDependentCTA() {
  const { isLoggedIn } = useAuth();

  // Only show "Start Your Journey" button if not logged in
  if (isLoggedIn) {
    return null;
  }

  return (
    <Link href="/register" className="btn bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white text-lg px-10 py-5 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary-500/25">
      <span className="flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Start Your Journey
      </span>
    </Link>
  );
}