'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

interface AuthContextType {
  isLoggedIn: boolean | undefined;
  setIsLoggedIn: (value: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<undefined | boolean>(undefined);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      await fetchUserProfile();
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    // Check for auth_token cookie on initial load
    checkAuthState();
  }, [checkAuthState]);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      userProfile,
      setUserProfile,
      fetchUserProfile,
      checkAuthState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}