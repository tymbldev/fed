import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BASE_URL } from './../../services/api';
import IndustryDropdown from './../../components/IndustryDropdown';

interface Company {
  companyId: number;
  companyName: string;
  logoUrl: string;
  headquarters: string;
  website: string;
  activeJobCount: number;
  companySize: string;
  specialties: string;
}

interface Industry {
  industryId: number;
  industryName: string;
  industryDescription: string;
  companyCount: number;
  topCompanies: Company[];
}

async function getIndustryWiseCompanies(): Promise<Industry[]> {
  const res = await fetch(`${BASE_URL}/api/v1/companies/industry-wise-companies`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  if (!res.ok) throw new Error('Failed to fetch industries');
  return res.json();
}

const IndustryPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const industries = await getIndustryWiseCompanies();
  console.log(industries);
  const selectedIndustry = industries.find(i => i.industryId === Number(id));
  if (!selectedIndustry) {
    return <div className="p-8">Industry not found.</div>;
  }

  return (
    <div>
      <div className="bg-blue-600 text-white p-8 rounded-b-2xl">
        <h1 className="text-3xl font-bold">Companies hiring on NaukriGulf</h1>
        <div className="mt-2">
          Industry: <IndustryDropdown industries={industries} selectedId={id} />
        </div>
      </div>
      <div className="container mx-auto mt-8">
        <h2 className="text-xl mb-4">Showing {selectedIndustry.topCompanies.length} companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {selectedIndustry.topCompanies.map(company => (
            <Link key={company.companyId} href={`/companies/${company.companyId}`}>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer">
                {company.logoUrl && (
                  <Image
                    src={company.logoUrl}
                    alt={company.companyName}
                    width={64}
                    height={64}
                    className="h-16 mb-4 object-contain"
                  />
                )}
                <div className="font-semibold text-lg text-center mb-2">{company.companyName}</div>
                <div className="text-sm text-gray-600 text-center mb-3">
                  {company.activeJobCount > 1 ? `${company.activeJobCount} Openings` : "No Openings"}
                </div>
                {company.specialties && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {company.specialties.split(', ').slice(0, 3).map((specialty: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
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
      </div>
    </div>
  );
};

export default IndustryPage;