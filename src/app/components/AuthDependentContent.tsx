'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AuthDependentContent() {
  const { isLoggedIn } = useAuth();

  // Only show "Join Our Network" button if not logged in
  if (isLoggedIn) {
    return null;
  }

  return (
    <Link href="/register" className="btn btn-outline text-lg px-8 py-[14px] transform hover:scale-105 transition-all duration-300 border-2 nprogress-trigger">
      <span className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Join Our Network
      </span>
    </Link>
  );
}