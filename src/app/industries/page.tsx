import React from 'react';
import { BASE_URL } from '../services/api';
import IndustryCard from '../components/IndustryCard';

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

const AllIndustriesPage: React.FC = async () => {
  let industries: Industry[] = [];
  let error: string | null = null;

  try {
    industries = await getIndustries();
    console.log(industries);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error fetching industries';
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
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