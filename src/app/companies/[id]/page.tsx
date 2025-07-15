"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BASE_URL } from "../../services/api";
import JobTuple from "../../components/JobTuple";

interface LocationOption {
  id: number;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  cityId: number;
  country: string;
  countryId: number;
  displayName: string;
  locationDisplay: string;
  remote: boolean;
  state: string;
  zipCode: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  designation: string;
  salary: number;
  currencyId: number;
  company: string;
  cityId: number;
  minExperience?: number;
  maxExperience?: number;
  openingCount?: number;
  createdAt: string;
}

interface Company {
  id: number;
  name: string;
  description?: string;
  logoUrl: string;
  aboutUs?: string;
  vision?: string;
  mission?: string;
  culture?: string;
  companySize?: string;
  headquarters?: string;
  primaryIndustryId?: number;
  secondaryIndustries?: string;
  specialties?: string;
  createdAt?: string;
  updatedAt?: string;
  jobs: Job[];
}

export default function CompanyPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data: LocationOption[] = await response.json();
      const locationMap = data.reduce((acc, location) => {
        acc[location.cityId] = location;
        return acc;
      }, {} as { [key: number]: LocationOption });
      setLocations(locationMap);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/companies/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
        }
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocations();
      fetchCompany();
    }
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!company) return <div className="text-center py-12">Company not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Company Header */}
      <div className="flex items-center mb-8">
        <Image src={company.logoUrl} alt={company.name} width={100} height={100} className="rounded-lg mr-6" />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
          {company.description && <p className="text-xl text-gray-600 mb-2">{company.description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {company.headquarters && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {company.headquarters}
              </div>
            )}
            {company.companySize && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {company.companySize}
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Company Information Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column */}
        <div className="space-y-6">
          {company.aboutUs && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">About Us</h2>
              <p className="text-gray-700 leading-relaxed">{company.aboutUs}</p>
            </div>
          )}
          {company.vision && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Vision</h2>
              <p className="text-gray-700 leading-relaxed">{company.vision}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {company.mission && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Mission</h2>
              <p className="text-gray-700 leading-relaxed">{company.mission}</p>
            </div>
          )}
          {company.culture && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Culture</h2>
              <p className="text-gray-700 leading-relaxed">{company.culture}</p>
            </div>
          )}
        </div>
      </div>

      {/* Specialties and Industries */}
      {(company.specialties || company.secondaryIndustries) && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Specialties & Industries</h2>
          <div className="flex flex-wrap gap-2">
            {company.specialties && company.specialties.split(',').map((specialty, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {specialty.trim()}
              </span>
            ))}
            {company.secondaryIndustries && company.secondaryIndustries.split(',').map((industry, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {industry.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Jobs Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
        {company.jobs && company.jobs.length > 0 ? (
          <div className="grid gap-4">
            {company.jobs.map((job) => (
              <JobTuple
                key={job.id}
                id={job.id}
                title={job.title}
                description={job.description}
                company={job.company}
                cityId={job.cityId}
                minExperience={job.minExperience}
                maxExperience={job.maxExperience}
                openingCount={job.openingCount}
                createdAt={job.createdAt}
                locations={locations}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6" />
            </svg>
            <p className="text-lg">No open positions at the moment</p>
            <p className="text-sm">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}