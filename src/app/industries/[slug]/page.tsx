import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { BASE_URL, fetchDropdownOptions } from './../../services/api';
import IndustryDropdown from './../../components/IndustryDropdown';
import Pagination from './../../components/Pagination';
import { slugify } from '../../utils/seo';

interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  createdAt: string | null;
  updatedAt: string;
  aboutUs: string;
  vision: string;
  mission: string;
  culture: string;
  jobs: unknown[];
  careerPageUrl: string;
  linkedinUrl: string;
  headquarters: string;
  primaryIndustryId: number;
  secondaryIndustries: string;
  companySize: string;
  specialties: string;
  activeJobCount?: number;
}
interface IndustryOption {
  id: number;
  name: string;
}

interface SpringBootPagination {
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface SpringBootSort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

interface CompaniesResponse {
  content: Company[];
  pageable: SpringBootPagination;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: SpringBootSort;
  numberOfElements: number;
  empty: boolean;
}


async function getIndustries(): Promise<IndustryOption[]> {
  const data = await fetchDropdownOptions('industries') as unknown as IndustryOption[];
  return data
}

async function getCompaniesByIndustry(industryId: number, page: number = 0, limit: number = 12): Promise<CompaniesResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/companies/by-industry/${industryId}?page=${page}&limit=${limit}`, {
    method: 'GET',
    next: { revalidate: 0 }
  });
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hdrs = await headers();
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
  const origin = `${protocol}://${host}`;

  const { slug } = await params;
  const industries = await getIndustries();
  const selectedIndustry = industries.find(i => slugify(i.name) === slug) || industries.find(i => i.id.toString() === slug);

  const siteName = 'TymblHub';
  const titleBase = selectedIndustry ? selectedIndustry.name : 'Industry';
  const title = `Companies hiring in ${titleBase} | ${siteName}`;
  const description = selectedIndustry
    ? `Discover companies hiring in ${selectedIndustry.name}. Explore open roles and apply on ${siteName}.`
    : `Discover companies hiring by industry. Explore open roles and apply on ${siteName}.`;
  const canonicalSlug = selectedIndustry ? slugify(selectedIndustry.name) : slug;
  const pageUrl = `${origin}/industries/${canonicalSlug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: pageUrl,
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

const IndustryPage = async ({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1');

  const industries = await getIndustries();
  const selectedIndustry = industries.find(i => slugify(i.name) === slug) || industries.find(i => i.id.toString() === slug);

  // If the incoming param was a numeric id, redirect to the canonical slug URL
  if (selectedIndustry && slug !== slugify(selectedIndustry.name)) {
    redirect(`/industries/${slugify(selectedIndustry.name)}${currentPage > 1 ? `?page=${currentPage}` : ''}`);
  }

  if (!selectedIndustry) {
    return <div className="p-8">Industry not found.</div>;
  }

  const companiesData = await getCompaniesByIndustry(Number(selectedIndustry.id), currentPage - 1, 12);

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalSlug = slugify(selectedIndustry.name);
  const breadcrumbJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': `${origin}/`, name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': `${origin}/industries`, name: 'Industries' } },
      { '@type': 'ListItem', position: 3, item: { '@id': `${origin}/industries/${canonicalSlug}`, name: selectedIndustry.name } },
    ],
  }).replace(/</g, '\\u003c');

  const itemListJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `${origin}/industries/${canonicalSlug}`,
    name: `Companies hiring in ${selectedIndustry.name}`,
    numberOfItems: companiesData.totalElements,
    itemListElement: companiesData.content.map((company, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${origin}/companies/${company.id}`,
      name: company.name,
    })),
  }).replace(/</g, '\\u003c');

  return (
    <div className="container mx-auto px-4 py-8">
      <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJson }} />
      <script id="schema-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJson }} />
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white float-left">
            Companies hiring in
          </h1>
          <IndustryDropdown industries={industries} selectedId={String(selectedIndustry.id)} />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Showing {companiesData.content.length} of {companiesData.totalElements} companies
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {companiesData.content.map(company => (
          <Link key={company.id} href={`/companies/${company.id}`} className="nprogress-trigger">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer p-6 flex flex-col items-center border border-gray-200 dark:border-gray-700">
              {company.logoUrl && (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  width={64}
                  height={64}
                  className="h-16 mb-4 object-contain"
                />
              )}
              <div className="font-semibold text-lg text-center mb-2 text-gray-900 dark:text-white">{company.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                {company.activeJobCount && company.activeJobCount > 1 ? `${company.activeJobCount} Openings` : "No Openings"}
              </div>
              {company.secondaryIndustries && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {company.secondaryIndustries.split(',').slice(0, 3).map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {companiesData.totalPages > 1 && (
        <Pagination
          currentPage={companiesData.number + 1}
          totalPages={companiesData.totalPages}
          baseUrl={`/industries/${canonicalSlug}`}
        />
      )}
    </div>
  );
};

export default IndustryPage;


