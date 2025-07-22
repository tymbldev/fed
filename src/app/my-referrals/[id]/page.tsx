'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { BASE_URL } from '../../services/api';

interface ReferralApplication {
  id: number;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantCompany?: string;
  applicantCityId?: number;
  applicantCountryId?: number;
  applicantCurrentSalary?: number;
  applicantCurrentSalaryCurrencyId?: number;
  applicantDesignation?: string;
  applicantMonthsOfExperience?: number;
  applicantYearsOfExperience?: number;
  applicantNoticePeriod?: number | null;
  applicantResume?: string;
  applicantResumeContentType?: string;
  applicantSkillNames?: string[];
  applicantGithubUrl?: string;
  applicantLinkedInUrl?: string;
  applicantPortfolioUrl?: string;
  referralId: number;
  referralTitle: string;
  referralDescription: string;
  referralCity: string;
  referralCountry: string;
  referralDesignationId: number;
  referralDesignation: string | null;
  referralSalary: number;
  referralCurrencyId: number;
  referralCompanyId: number;
  referralCompany: string;
  referralSkillIds: number[];
  coverLetter: string;
  resumeUrl: string | null;
  applicationStatus: 'PENDING' | 'SHORTLISTED' | 'REJECTED';
  applicantSkills: string[];
  experience: string;
  education: string;
  portfolioUrl: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ReferralApplications() {
  const params = useParams();
  const referralId = params.id as string;

  const [applications, setApplications] = useState<ReferralApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currencies, setCurrencies] = useState<{ [key: number]: string }>({});
  const [countries, setCountries] = useState<{ [key: number]: string }>({});
  const [cities, setCities] = useState<{ [key: number]: { city: string; country: string } }>({});

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/currencies`);
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      const data = await response.json();
      const currencyMap = data.reduce((acc: { [key: number]: string }, currency: { id: number; code: string }) => {
        acc[currency.id] = currency.code;
        return acc;
      }, {});
      setCurrencies(currencyMap);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast.error('Failed to fetch currencies');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      const countryMap = data.reduce((acc: { [key: number]: string }, location: { countryId: number; country: string }) => {
        if (location.countryId && location.country) {
          acc[location.countryId] = location.country;
        }
        return acc;
      }, {} as { [key: number]: string });
      setCountries(countryMap);

      // Also create city mapping
      const cityMap = data.reduce((acc: { [key: number]: { city: string; country: string } }, location: { cityId: number; city: string; country: string }) => {
        if (location.cityId && location.city && location.country) {
          acc[location.cityId] = { city: location.city, country: location.country };
        }
        return acc;
      }, {} as { [key: number]: { city: string; country: string } });
      setCities(cityMap);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries');
    }
  };

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const response = await fetch(`${BASE_URL}/api/v1/job-applications/${referralId}/referrer-action?applicantId=${applicationId}&status=${newStatus}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      toast.success('Application status updated successfully');

      // Refresh applications by refetching
      const refreshResponse = await fetch(`${BASE_URL}/api/v1/job-applications/job/${referralId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (refreshResponse.ok) {
        const data: ReferralApplication[] = await refreshResponse.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        const response = await fetch(`${BASE_URL}/api/v1/job-applications/job/${referralId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data: ReferralApplication[] = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to fetch applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
    fetchCountries();
    fetchApplications();
  }, [referralId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLocation = (application: ReferralApplication) => {
    const { referralCity, referralCountry } = application;
    if (referralCity && referralCountry) return `${referralCity}, ${referralCountry}`;
    if (referralCity) return referralCity;
    if (referralCountry) return referralCountry;
    return 'Location not specified';
  };



  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US').format(salary);
  };

  const getCurrencyCode = (currencyId: number | undefined) => {
    if (!currencyId) return '';
    return currencies[currencyId] || '';
  };

  const getCountryName = (countryId: number | undefined) => {
    if (!countryId) return '';
    return countries[countryId] || '';
  };

  const getLocationDisplay = (application: ReferralApplication) => {
    // Use applicantCityId and applicantCountryId for location display
    if (application.applicantCityId && cities[application.applicantCityId]) {
      const cityData = cities[application.applicantCityId];
      return `${cityData.city}, ${cityData.country}`;
    }

    // Fallback to country only if we have applicantCountryId
    if (application.applicantCountryId) {
      const countryName = getCountryName(application.applicantCountryId);
      if (countryName) {
        return countryName;
      }
    }

    // Final fallback to the original formatLocation function
    return formatLocation(application);
  };

  const formatExperience = (years: number, months: number) => {
    if (years > 0 && months > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return 'Not specified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SHORTLISTED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatUrl = (url: string | null | undefined): string => {
    if (!url) return '#';

    // If URL already has protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Add https:// if no protocol is present
    return `https://${url}`;
  };

  const downloadResume = async (resumeUrl: string, applicantName: string, contentType?: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const response = await fetch(resumeUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Set filename based on content type and applicant name
      let extension = '.pdf'; // Default to PDF
      if (contentType) {
        switch (contentType) {
          case 'application/pdf':
            extension = '.pdf';
            break;
          case 'application/msword':
            extension = '.doc';
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            extension = '.docx';
            break;
          case 'text/plain':
            extension = '.txt';
            break;
          default:
            extension = '.pdf'; // Default fallback
        }
      }
      const filename = `${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}_resume${extension}`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const filteredApplications = statusFilter === 'ALL'
    ? applications
    : applications.filter(app => app.applicationStatus === statusFilter);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  const referralDetails = applications.length > 0 ? applications[0] : null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <Link
              href="/my-referrals"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Referrals
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Referral Applications</h1>
            {referralDetails && (
              <div className="mt-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">{referralDetails.referralTitle}</h2>
                <p className="text-gray-500">
                  {referralDetails.referralCompany}
                </p>
              </div>
            )}
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-indigo-600">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium border ${
                statusFilter === 'ALL'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium border ${
                statusFilter === 'PENDING'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Pending ({applications.filter((app) => app.applicationStatus === 'PENDING').length})
            </button>
            <button
              onClick={() => setStatusFilter('SHORTLISTED')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium border ${
                statusFilter === 'SHORTLISTED'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Shortlisted ({applications.filter((app) => app.applicationStatus === 'SHORTLISTED').length})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium border ${
                statusFilter === 'REJECTED'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Rejected ({applications.filter((app) => app.applicationStatus === 'REJECTED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <p className="text-gray-500">No applications found for this referral.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2">{index + 1}.</span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">
                        {application.applicantName}
                        {application.applicantYearsOfExperience !== undefined && application.applicantMonthsOfExperience !== undefined &&
                          ` (${formatExperience(application.applicantYearsOfExperience, application.applicantMonthsOfExperience)})`}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-5 mb-4">
                      {application.applicantDesignation || application.referralDesignation || 'Designation not specified'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 text-sm ml-5">
                      <div>
                        <p className="text-gray-500">Current Company</p>
                        <p className="text-gray-800 font-semibold">{application.applicantCompany || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="text-gray-800 font-semibold">
                          {application.applicantYearsOfExperience !== undefined && application.applicantMonthsOfExperience !== undefined
                            ? formatExperience(application.applicantYearsOfExperience, application.applicantMonthsOfExperience)
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Salary</p>
                        <p className="text-gray-800 font-semibold">
                          {application.applicantCurrentSalary
                            ? `${getCurrencyCode(application.applicantCurrentSalaryCurrencyId)} ${formatSalary(application.applicantCurrentSalary)}`
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-gray-800 font-semibold">
                          {getLocationDisplay(application)}
                        </p>
                      </div>

                      {application.education && (
                        <div>
                          <p className="text-gray-500">Education</p>
                          <p className="text-gray-800 font-semibold">{application.education}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                        {(application.applicantPortfolioUrl || application.portfolioUrl) && (
                          <a
                            href={formatUrl(application.applicantPortfolioUrl || application.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Image src="/icons/weblink.svg" alt="Portfolio" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" width={20} height={20} />
                            Portfolio
                          </a>
                        )}
                        {(application.applicantLinkedInUrl || application.linkedInUrl) && (
                          <a
                            href={formatUrl(application.applicantLinkedInUrl || application.linkedInUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs sm:text-sm text-blue-700 hover:text-blue-800"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </a>
                        )}
                        {(application.applicantGithubUrl || application.githubUrl) && (
                          <a
                            href={formatUrl(application.applicantGithubUrl || application.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs sm:text-sm text-gray-800 hover:text-gray-900"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:ml-4 flex-shrink-0 flex items-center justify-center sm:justify-start">
                    <select
                      value={application.applicationStatus}
                      onChange={(e) => updateApplicationStatus(application.applicantId, e.target.value)}
                      className={`w-full sm:w-auto border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500 ${getStatusColor(application.applicationStatus)}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills Section - Full Width */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(application.applicantSkillNames || application.applicantSkills || []).length > 0 ? (
                    (application.applicantSkillNames || application.applicantSkills || []).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Not mentioned</span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  Applied on {formatDate(application.createdAt)}
                </p>
                {(application.resumeUrl || application.applicantResume) && (
                  <button
                    onClick={() => downloadResume(
                      (application.applicantResume || application.resumeUrl) || '',
                      application.applicantName,
                      application.applicantResumeContentType
                    )}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}