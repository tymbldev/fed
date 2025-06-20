'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { BASE_URL } from '../../services/api';

interface ReferralApplication {
  id: number;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
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
  status: 'PENDING' | 'SHORTLISTED' | 'REJECTED';
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

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const response = await fetch(`${BASE_URL}/api/v1/job-applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      toast.success('Application status updated successfully');

      // Refresh applications
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  useEffect(() => {
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

  const getSkillNames = (application: ReferralApplication) => {
    if (!application.applicantSkills || application.applicantSkills.length === 0) return 'Not mentioned';
    return application.applicantSkills.join(', ');
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US').format(salary);
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

  const filteredApplications = statusFilter === 'ALL'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  const referralDetails = applications.length > 0 ? applications[0] : null;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/my-referral"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Referrals
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Referral Applications</h1>
            {referralDetails && (
              <div className="mt-2">
                <h2 className="text-xl font-semibold text-gray-700">{referralDetails.referralTitle}</h2>
                <p className="text-gray-500">
                  {referralDetails.referralCompany}
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-indigo-600">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                statusFilter === 'ALL'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Applications ({applications.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                statusFilter === 'PENDING'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Pending ({applications.filter((app) => app.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setStatusFilter('SHORTLISTED')}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                statusFilter === 'SHORTLISTED'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Shortlisted ({applications.filter((app) => app.status === 'SHORTLISTED').length})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                statusFilter === 'REJECTED'
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Rejected ({applications.filter((app) => app.status === 'REJECTED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No applications found for this referral.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2">{index + 1}.</span>
                      <h3 className="text-lg font-bold text-gray-800">
                        {application.applicantName}
                        {application.experience && ` (${application.experience})`}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-5 mb-4">{application.referralDesignation || 'Designation not specified'}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm ml-5">
                      <div>
                        <p className="text-gray-500">Current Company</p>
                        <p className="text-gray-800 font-semibold">{referralDetails?.referralCompany}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-gray-800 font-semibold">{formatLocation(application)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monthly Salary</p>
                        <p className="text-gray-800 font-semibold">{formatSalary(application.referralSalary)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Key Skills</p>
                        <p className="text-gray-800 font-semibold">{getSkillNames(application)}</p>
                      </div>
                      {application.education && (
                        <div>
                          <p className="text-gray-500">Education</p>
                          <p className="text-gray-800 font-semibold">{application.education}</p>
                        </div>
                      )}
                       <div className="flex space-x-2 items-center">
                        {application.portfolioUrl && (
                          <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-500">Portfolio</a>
                        )}
                        {application.linkedInUrl && (
                          <a href={application.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-500">LinkedIn</a>
                        )}
                        {application.githubUrl && (
                          <a href={application.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-500">GitHub</a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                      className={`border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500 ${getStatusColor(application.status)}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Applied on {formatDate(application.createdAt)}
                </p>
                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}