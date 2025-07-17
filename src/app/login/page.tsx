'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/profile';

  return (
    <LoginForm
      title="Welcome back"
      subtitle={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300">
            Sign up
          </Link>
        </>
      }
      showLinks={true}
      redirectTo={redirectTo}
    />
  );
}