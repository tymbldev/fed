export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    // credentials: 'include', // if using cookies/session-based login
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  } else {
    const data = await response.json();
    console.log(data);
    if (data.token) {
      document.cookie = `auth_token=${data.token}; path=/; ${
        process.env.NODE_ENV === 'production' ? 'secure;' : ''
      } samesite=strict; max-age=${60 * 60 * 24 * 7}`;
    }
  }

  // return response.json();
};

export const updateProfile = async (profileData: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  designationId?: number;
  departmentId?: number;
  cityId?: number;
  countryId?: number;
  yearsOfExperience?: number;
  monthsOfExperience?: number;
  skills?: string[];
}) => {
  // Get the token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${BASE_URL}/api/v1/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Profile update failed');
  }

  return response.json();
};

export const fetchDropdownOptions = async (type: string): Promise<{ value: string; label: string }[]> => {
  try {
    // Special handling for skills
    if (type === 'skills') {
      const response = await fetch(`${BASE_URL}/api/v1/skills`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await response.json();
      return data;
    }

    // Special handling for companies
    if (type === 'companies') {
      const response = await fetch(`${BASE_URL}/api/v1/companies`);
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      return data;
    }

    // For other dropdowns, use the dropdowns endpoint
    const response = await fetch(`${BASE_URL}/api/v1/dropdowns/${type}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

export const fetchSkills = async (query: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/skills?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch skills');
  }

  const data = await response.json();
  return data.map((skill: { id: number; name: string }) => ({
    value: skill.name,
    label: skill.name
  }));
};