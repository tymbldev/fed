import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../services/api';
import GenericCarousel from './common/GenericCarousel';
import IndustryCard from './IndustryCard';

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
}

const IndustriesCarousel: React.FC = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/v1/companies/industry-wise-companies`);
        if (!res.ok) throw new Error('Failed to fetch industries');
        const data = await res.json();
        setIndustries(data);
      } catch (err: unknown) {
        let message = 'Error fetching industries';
        if (err instanceof Error) message = err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  if (loading) {
    return <div className="w-full flex justify-center items-center py-12">Loading industries...</div>;
  }
  if (error) {
    return <div className="w-full flex justify-center items-center py-12 text-red-500">{error}</div>;
  }

  return (
    <GenericCarousel
      title="Active Jobs across Industries"
      viewAllLink={{ href: "/industries", text: "View All" }}
    >
      {industries.slice(0, 50).map((industry) => (
        <div key={industry.industryId} className="pb-2 bg-transparent">
          <IndustryCard industry={industry} />
        </div>
      ))}
    </GenericCarousel>
  );
};

export default IndustriesCarousel;