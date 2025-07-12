export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// TypeScript declarations for File System Access API
declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
  }

  interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>;
  }

  interface FileSystemWritableFileStream extends WritableStream {
    write(data: Blob | string): Promise<void>;
    close(): Promise<void>;
  }
}

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

  const data = await response.json();

  // Check if a new token is provided in the response and update the cookie
  if (data.token) {
    document.cookie = `auth_token=${data.token}; path=/; ${
      process.env.NODE_ENV === 'production' ? 'secure;' : ''
    } samesite=strict; max-age=${60 * 60 * 24 * 7}`;
  }

  return data;
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

    // // Special handling for companies
    // if (type === 'companies') {
    //   const response = await fetch(`${BASE_URL}/api/v1/companies`);
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch companies');
    //   }
    //   const data = await response.json();
    //   return data;
    // }

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
    value: skill.id,
    label: skill.name
  }));
};

export const uploadResume = async (file: File, userId: number, userName?: string) => {
  // Get the token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error('Authentication token not found');
  }

  // Rename file with user name if provided
  let fileToUpload = file;
  if (userName) {
    const fileExtension = file.name.split('.').pop();
    const newFileName = `${userName}.${fileExtension}`;
    fileToUpload = new File([file], newFileName, { type: file.type });
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('userId', userId.toString());

  const response = await fetch(`${BASE_URL}/api/v1/resumes/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Resume upload failed');
  }

  return response.json();
};

export const downloadResume = async (resumeUuid: string, fileName?: string) => {
  // Get the token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${BASE_URL}/api/v1/resumes/download/${resumeUuid}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Resume download failed');
  }

  const blob = await response.blob();

  // Use the browser's native file save dialog
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName || `resume_${resumeUuid}.pdf`,
        types: [{
          description: 'Resume File',
          accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/rtf': ['.rtf'],
            'text/rtf': ['.rtf']
          }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch {
      // Fallback to automatic download if user cancels or browser doesn't support showSaveFilePicker
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || `resume_${resumeUuid}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } else {
    // Fallback for browsers that don't support showSaveFilePicker
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `resume_${resumeUuid}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

export const deleteResume = async () => {
  // Get the token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${BASE_URL}/api/v1/resumes`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Resume deletion failed');
  }

  return response.json();
};