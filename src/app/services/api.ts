import { indexedDBService } from './indexedDB';

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

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

export const fetchDropdownOptions = async (type: string): Promise<{ id: string; name: string }[]> => {
  try {
    console.log("fetchDropdownOptions called for type:", type);
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // Server-side rendering - fetch directly
      console.log("Server-side rendering, fetching directly");
      return await fetchDropdownOptionsFromAPI(type);
    }

    // Try to get cached data first
    const cachedData = await indexedDBService.getDropdownOptions(type);
    if (cachedData) {
      console.log(`Using cached ${type} data`);
      return cachedData;
    }

    // If no cached data, fetch from API
    console.log(`Fetching ${type} data from API`);
    const data = await fetchDropdownOptionsFromAPI(type);
    // console.log(`fetchDropdownOptionsFromAPI data for ${type}`, data);

    // Cache the data
    try {
      await indexedDBService.setDropdownOptions(type, data);
      console.log(`Cached ${type} data successfully`);
    } catch (cacheError) {
      console.warn(`Failed to cache ${type} data:`, cacheError);
      // Don't throw error if caching fails, just return the data
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

// Helper function to fetch dropdown options from API
const fetchDropdownOptionsFromAPI = async (type: string): Promise<{ id: string; name: string }[]> => {
  // console.log(`fetchDropdownOptionsFromAPI called for type: ${type}`);

  // Special handling for skills (different endpoint structure)
  if (type === 'skills') {
    // console.log(`Fetching skills from: ${BASE_URL}/api/v1/skills`);
    const response = await fetch(`${BASE_URL}/api/v1/skills`);
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    const data = await response.json();
    // console.log('Skills raw data:', data);
    const mappedData = data.map((skill: { id: number; name: string }) => ({
      id: skill.id.toString(),
      name: skill.name
    }));
    // console.log('Skills mapped data:', mappedData);
    return mappedData;
  }

  // For all other dropdowns (including companies and designations), use the standard endpoint
  console.log('fetchDropdownOptionsFromAPI', `${BASE_URL}/api/v1/dropdowns/${type}`);
  const response = await fetch(`${BASE_URL}/api/v1/dropdowns/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }
  const data = await response.json();
  console.log(`all dropdowns data for ${type}`, data);

  // Special handling for location and currency - return as-is
  if (type === 'locations' || type === 'currency') {
    return data;
  }

  // Ensure all other dropdowns return consistent {id, name} format
  const mappedData = data.map((item: { id: number; name: string }) => ({
    id: item.id.toString(),
    name: item.name
  }));

  return mappedData;
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
    id: skill.id.toString(),
    name: skill.name
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

// Utility functions for cache management
export const clearDropdownCache = async (type?: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (type) {
      await indexedDBService.deleteDropdownOptions(type);
      console.log(`Cleared cache for ${type}`);
    } else {
      await indexedDBService.clearAllData();
      console.log('Cleared all dropdown cache');
    }
  } catch (error) {
    console.error('Error clearing dropdown cache:', error);
    throw error;
  }
};

export const refreshDropdownCache = async (type: string): Promise<{ id: string; name: string }[]> => {
  // Clear the cache for this type
  await clearDropdownCache(type);

  // Fetch fresh data
  return await fetchDropdownOptions(type);
};

export const getDropdownCacheInfo = async (): Promise<{ type: string; timestamp: number }[]> => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const db = await indexedDBService.initDB();
    const transaction = db.transaction(['dropdownOptions'], 'readonly');
    const store = transaction.objectStore('dropdownOptions');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject(new Error('Failed to get cache info'));
      };

      request.onsuccess = () => {
        const results = request.result as Array<{ type: string; timestamp: number }>;
        resolve(results.map(item => ({
          type: item.type,
          timestamp: item.timestamp
        })));
      };
    });
  } catch (error) {
    console.error('Error getting cache info:', error);
    return [];
  }
};