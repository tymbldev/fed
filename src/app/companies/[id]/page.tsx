"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BASE_URL } from "../../services/api";

interface Job {
  id: number;
  title: string;
  description: string;
  designation: string;
  salary: number;
  currencyId: number;
}

interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logoUrl: string;
  aboutUs?: string;
  vision?: string;
  mission?: string;
  culture?: string;
  jobs: Job[];
}

export default function CompanyPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (id) fetchCompany();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!company) return <div className="text-center py-12">Company not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center mb-6">
        <Image src={company.logoUrl} alt={company.name} width={80} height={80} className="rounded-lg mr-4" />
        <div>
          <h1 className="text-3xl font-bold mb-1">{company.name}</h1>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{company.website}</a>
          )}
        </div>
      </div>
      {company.description && <p className="mb-4 text-gray-700">{company.description}</p>}
      {company.aboutUs && <p className="mb-4 text-gray-700"><b>About us:</b> {company.aboutUs}</p>}
      {company.vision && <p className="mb-4 text-gray-700"><b>Vision:</b> {company.vision}</p>}
      {company.mission && <p className="mb-4 text-gray-700"><b>Mission:</b> {company.mission}</p>}
      {company.culture && <p className="mb-4 text-gray-700"><b>Culture:</b> {company.culture}</p>}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Open Jobs</h2>
      {company.jobs && company.jobs.length > 0 ? (
        <ul className="space-y-4">
          {company.jobs.map((job) => (
            <li key={job.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-lg font-bold mb-1">{job.title}</h3>
              <div className="text-sm text-gray-600 mb-2">{job.designation}</div>
              <div className="mb-2">{job.description}</div>
              <div className="text-green-700 font-semibold">Salary: {job.salary}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500">No jobs available at the moment.</div>
      )}
    </div>
  );
}