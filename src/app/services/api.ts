const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  firstName: string;
  lastName: string;
  phoneNumber: string;
  designationId: number;
  departmentId: number;
  cityId: number;
  countryId: number;
  yearsOfExperience: number;
  skills: string[];
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