import { Referral, Currency, LocationOption, Application, Referrer } from '../types/common';

export interface CompanySummary {
  companyId: number;
  companyName: string;
  logoUrl: string;
  website: string;
  headquarters: string;
  activeJobCount: number;
}

export interface Industry {
  industryId: number;
  industryName: string;
  industryDescription: string;
  companyCount: number;
  topCompanies: CompanySummary[];
  totalJobCount: number;
}

export interface CompanyDetails {
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

export interface Job {
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

export interface TopDesignation {
  designationName: string;
  jobCount: number;
}

export interface TopDesignationsResponse {
  topDesignations: TopDesignation[];
  totalJobs: number;
  totalDesignations: number;
}

export interface TopSkill {
  skillName: string;
  jobCount: number;
}

export interface TopSkillsResponse {
  topSkills: TopSkill[];
  totalSkills: number;
  totalJobs: number;
}

export async function fetchIndustries(): Promise<Industry[]> {
  try {
    // For server-side fetching, we need to use the full URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/companies/industry-wise-companies`, {
      // Add cache options for better performance
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch industries');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching industries:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function fetchReferralDetails(jobId: string): Promise<Referral | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/jobsearch/${jobId}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referral details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching referral details:', error);
    return null;
  }
}

export async function fetchCurrencies(): Promise<{ [key: number]: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/dropdowns/currencies`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch currencies');
    }

    const data: Currency[] = await response.json();
    return data.reduce((acc, currency) => {
      acc[currency.id] = currency.code;
      return acc;
    }, {} as { [key: number]: string });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return {};
  }
}

export async function fetchLocations(): Promise<{ [key: number]: LocationOption }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/dropdowns/locations`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data: Array<{
      id?: number;
      addressLine1?: string | null;
      addressLine2?: string | null;
      city: string;
      cityId: number;
      country: string;
      countryId?: number;
      displayName?: string;
      locationDisplay?: string;
      remote?: boolean;
      state?: string;
      zipCode?: string;
    }> = await response.json();
    return data.reduce((acc, location) => {
      acc[location.cityId] = {
        id: location.id || location.cityId,
        addressLine1: location.addressLine1 || null,
        addressLine2: location.addressLine2 || null,
        city: location.city,
        cityId: location.cityId,
        country: location.country,
        countryId: location.countryId || 1,
        displayName: location.displayName || location.city,
        locationDisplay: location.locationDisplay || `${location.city}, ${location.country}`,
        remote: location.remote || false,
        state: location.state || '',
        zipCode: location.zipCode || ''
      };
      return acc;
    }, {} as { [key: number]: LocationOption });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return {};
  }
}



export async function fetchReferrers(jobId: string): Promise<Referrer[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/jobsearch/${jobId}/referrers`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referrers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching referrers:', error);
    return [];
  }
}

export async function fetchApplicationStatus(jobId: string, token: string | null): Promise<{ application: Application | null; status: string | null }> {
  if (!token) {
    return { application: null, status: null };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/my-applications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', // Don't cache application status
    });

    if (!response.ok) {
      throw new Error('Failed to fetch application status');
    }

    const data: Application[] = await response.json();
    console.log(data);
    const application = data.find(app => app.jobId === Number(jobId));

    return {
      application: application || null,
      status: application ? application.status : null
    };
  } catch (error) {
    console.error('Error fetching application status:', error);
    return { application: null, status: null };
  }
}

export async function fetchCompanyDetails(companyId: string): Promise<CompanyDetails | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/companies/${companyId}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch company details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching company details:', error);
    return null;
  }
}

export async function fetchTopDesignations(): Promise<TopDesignationsResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/seo/designations/top?limit=18`, {
      next: { revalidate: 900 }, // Revalidate every 15 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top designations');
    }

    const data: TopDesignationsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top designations:', error);
    return { topDesignations: [], totalJobs: 0, totalDesignations: 0 };
  }
}

export async function fetchTopSkills(): Promise<TopSkillsResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/seo/skills/top?limit=27`, {
      next: { revalidate: 900 }, // Revalidate every 15 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top skills');
    }

    const data: TopSkillsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top skills:', error);
    return { topSkills: [], totalSkills: 0, totalJobs: 0 };
  }
}