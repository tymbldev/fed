export interface Option {
  id: number;
  name: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Referral {
  id: number;
  title: string;
  description: string;
  cityId: number;
  cityName: string;
  company: string;
  companyName: string;
  companyId: number;
  countryId: number;
  countryName: string;
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