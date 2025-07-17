'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthDependentWelcome() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-green-50 p-6 rounded-lg mb-8">
      <p className="text-green-800 font-medium">
        Welcome back! You&apos;re logged in and can access all our features.
      </p>
    </div>
  );
}