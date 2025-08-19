import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { BASE_URL } from '../services/api';
import IndustryCard from '../components/IndustryCard';
import { slugify } from '../utils/seo';

interface Company {
  companyId: number;
  companyName: string;
  logoUrl: string;
  website: string;
  headquarters: string;
  activeJobCount: number;
}

interface Industry {
  industryId: number;
  industryName: string;
  industryDescription: string;
  companyCount: number;
  topCompanies: Company[];
  totalJobCount: number;
}

// Server-side data fetching function
async function getIndustries(): Promise<Industry[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/companies/industry-wise-companies`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch industries');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  const siteName = 'TymblHub';
  const title = `Active Jobs across Industries | ${siteName}`;
  const description = `Explore industries and discover companies that are actively hiring. Find your next opportunity on ${siteName}.`;
  const listingUrl = `${origin}/industries`;

  return {
    title,
    description,
    alternates: { canonical: listingUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: listingUrl,
      siteName,
      type: 'website',
      images: [{ url: `${origin}/logo.png` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${origin}/logo.png`],
    },
  };
}

const AllIndustriesPage: React.FC = async () => {
  let industries: Industry[] = [];
  let error: string | null = null;

  try {
    industries = await getIndustries();
    console.log(industries);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error fetching industries';
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumbJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': `${origin}/`, name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': `${origin}/industries`, name: 'Industries' } },
    ],
  }).replace(/</g, '\\u003c');

  const itemListJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `${origin}/industries`,
    name: 'Industries',
    numberOfItems: industries.length,
    itemListElement: industries.map((ind, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${origin}/companies-hiring-in-${slugify(ind.industryName)}`,
      name: ind.industryName,
    })),
  }).replace(/</g, '\\u003c');

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJson }} />
        <script id="schema-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJson }} />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Active Jobs across Industries</h1>

        {error ? (
          <div className="w-full flex justify-center items-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {industries.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No industries found.</div>
            ) : (
              industries.map(industry => (
                <IndustryCard key={industry.industryId} industry={industry} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIndustriesPage;