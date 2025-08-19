import type { Metadata } from 'next';
import React from 'react';

const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const canonical = `${origin}/register`;

export const metadata: Metadata = {
  title: 'Create Account - TymblHub',
  description: 'Create your TymblHub account to post referrals or find jobs.',
  alternates: { canonical },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Create Account - TymblHub',
    description: 'Join TymblHub to post and discover referrals.',
    url: canonical,
    siteName: 'TymblHub',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}


