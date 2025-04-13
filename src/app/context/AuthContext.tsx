'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  designationId?: number;
  departmentId?: number;
  positionDisplay?: string;
  departmentDisplay?: string;
  cityId?: number | null;
  countryId?: number | null;
  yearsOfExperience?: number;
  skillIds?: string[];
  company?: string;
  role?: string;
  profileCompletionPercentage?: number;
  profilePicture?: string | null;
  resume?: string | null;
  education?: Education[];
  currentSalary?: number | null;
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
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch('https://www.tymblhub.com/tymbl-service/api/v1/users/profile', {
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
  };

  useEffect(() => {
    // Check for auth_token cookie on initial load
    const checkAuth = async () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        await fetchUserProfile();
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      userProfile,
      setUserProfile,
      fetchUserProfile
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