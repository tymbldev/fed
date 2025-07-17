import { cookies } from 'next/headers';
import { BASE_URL } from '../services/api';

interface Education {
  id?: number;
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  designation?: string;
  designationId?: number;
  departmentId?: number;
  positionDisplay?: string;
  departmentDisplay?: string;
  cityId?: number | null;
  countryId?: number | null;
  yearsOfExperience?: number;
  monthsOfExperience?: number;
  skillIds?: string[];
  skillNames?: string[];
  company?: string;
  companyId?: number;
  role?: string;
  profileCompletionPercentage?: number;
  profilePicture?: string | null;
  resume?: string | null;
  resumeContentType?: string | null;
  education?: Education[];
  currentSalary?: number | null;
  currentSalaryCurrencyId?: number | null;
  expectedSalary?: number | null;
  noticePeriod?: number | null;
  githubProfile?: string | null;
  linkedInProfile?: string | null;
  portfolioWebsite?: string | null;
  zipCode?: string | null;
  locationDisplay?: string | null;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiry?: string | null;
  provider?: string | null;
  providerId?: string | null;
  enabled?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  authorities?: { authority: string }[];
  updatedAt?: string;
  personalWebsite?: string | null;
}

export interface AuthState {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
}

export async function getServerAuthState(): Promise<AuthState> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        isLoggedIn: false,
        userProfile: null
      };
    }

    // Fetch user profile from server
    const response = await fetch(`${BASE_URL}/api/v1/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      // Disable cache to ensure fresh data
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        isLoggedIn: false,
        userProfile: null
      };
    }

    const userProfile: UserProfile = await response.json();

    return {
      isLoggedIn: true,
      userProfile
    };
  } catch (error) {
    console.error('Error getting server auth state:', error);
    return {
      isLoggedIn: false,
      userProfile: null
    };
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}