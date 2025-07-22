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

export interface Referral {
  id: number;
  title: string;
  description: string;
  cityId: number;
  company: string;
  companyId: number;
  countryId: number;
  currencyId: number;
  designation: string | null;
  designationId: number;
  minSalary: number;
  maxSalary: number;
  minExperience: number | null;
  maxExperience: number | null;
  openingCount: number;
  jobType: string | null;
  platform: string;
  tags: string[];
  uniqueUrl: string;
  approvalStatus: string;
  approved: number;
  actualPostedBy: number | null;
  superAdminPosted: boolean;
  userRole: string | null;
  referrerCount: number;
  active: boolean;
  postedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isActive: boolean;
}

export interface LocationOption {
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

export interface Application {
  id: number;
  jobId: number;
  referralTitle: string;
  applicantId: number;
  applicantName: string;
  status: string;
  createdAt: string;
  jobReferrerId?: number;
  referrerName?: string;
  referrerDesignation?: string;
}

export interface Referrer {
  userId: number;
  userName: string;
  designation: string;
  numApplicationsAccepted: number;
  feedbackScore: number;
  overallScore: number;
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