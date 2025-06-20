'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Job {
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
  salary: number;
  active: boolean;
  postedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isActive: boolean;
}

interface LocationOption {
  cityId: number;
  city: string;
  country: string;
}

interface DesignationOption {
  id: number;
  name: string;
}

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantId: number;
  applicantName: string;
  status: string;
  createdAt: string;
}

export default function JobDetails() {
  const params = useParams();
  const { userProfile, isLoggedIn } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [currencies, setCurrencies] = useState<{ [key: number]: string }>({});
  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [designations, setDesignations] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/currencies`);
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      const data: Currency[] = await response.json();
      const currencyMap = data.reduce((acc, currency) => {
        acc[currency.id] = currency.code;
        return acc;
      }, {} as { [key: number]: string });
      setCurrencies(currencyMap);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast.error('Failed to fetch currencies');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data: LocationOption[] = await response.json();
      const locationMap = data.reduce((acc, location) => {
        acc[location.cityId] = location;
        return acc;
      }, {} as { [key: number]: LocationOption });
      setLocations(locationMap);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/designations`);
      if (!response.ok) {
        throw new Error('Failed to fetch designations');
      }
      const data: DesignationOption[] = await response.json();
      const designationMap = data.reduce((acc, designation) => {
        acc[designation.id] = designation.name;
        return acc;
      }, {} as { [key: number]: string });
      setDesignations(designationMap);
    } catch (error) {
      console.error('Error fetching designations:', error);
      toast.error('Failed to fetch designations');
    }
  };

  const fetchApplicationStatus = async () => {
    if (!isLoggedIn) {
      return; // Don't fetch if user is not logged in
    }

    try {
      setIsCheckingApplication(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        console.log('No auth token found for application status fetch');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/my-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application status');
      }

      const data: Application[] = await response.json();
      const application = data.find(app => app.jobId === Number(params.id));
      setApplicationStatus(application ? application.status : null);
    } catch (error) {
      console.error('Error fetching application status:', error);
      // Don't show error toast for this as it might be expected for non-logged in users
    } finally {
      setIsCheckingApplication(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/jobsearch/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      const data = await response.json();
      setJob(data);
    } catch (error) {
      toast.error('Failed to fetch job details');
      console.error('Error fetching job details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    fetchLocations();
    fetchDesignations();
    fetchJobDetails();
    fetchApplicationStatus();
  }, [params.id, isLoggedIn]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: number, currencyId: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencies[currencyId] || 'USD',
    }).format(salary);
  };

  const handleApply = async () => {
    if (!userProfile) {
      toast.error('Please login to apply for jobs');
      return;
    }

    if (applicationStatus) {
      toast.error('You have already applied for this job');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/my-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]}`
        },
        body: JSON.stringify({
          jobId: params.id,
          coverLetter: 'test'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to apply for job');
      }

      toast.success('Successfully applied for the job!');
      // Refresh application status after successful application
      fetchApplicationStatus();
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to apply for job');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Job not found</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xl">{job.company}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xl">
                {locations[job.cityId]?.city}, {locations[job.cityId]?.country}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl">{formatSalary(job.salary, job.currencyId)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Posted on {formatDate(job.createdAt)}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Job Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Designation:</span> {designations[job.designationId] || 'Not specified'}</p>
                <p><span className="font-medium">Status:</span> {job.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
            <div className="whitespace-pre-wrap text-gray-700" dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>

          <div className="mt-8">
            {isLoggedIn && applicationStatus && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    You have already applied for this job - Status: {applicationStatus}
                  </span>
                </div>
              </div>
            )}

            {!isLoggedIn && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  💡 Please <a href="/login" className="underline font-medium">log in</a> to apply for this job.
                </p>
              </div>
            )}

            <button
              onClick={handleApply}
              disabled={!isLoggedIn || !!applicationStatus || isCheckingApplication}
              className={`px-6 py-3 rounded-lg transition duration-200 ${
                !isLoggedIn || !!applicationStatus
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[#1a73e8] text-white hover:bg-[#1a73e8]/90'
              }`}
            >
              {isCheckingApplication ? 'Checking...' : applicationStatus ? 'Already Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}