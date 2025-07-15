'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';

interface Referral {
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
  minSalary: number;
  maxSalary: number;
  minExperience: number | null;
  maxExperience: number | null;
  openingCount: number;
  jobType: string | null;
  platform: string;
  tags: string[];
  uniqueUrl: string;
  approvalStatus: string;
  approved: number;
  actualPostedBy: number | null;
  superAdminPosted: boolean;
  userRole: string | null;
  referrerCount: number;
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

interface Application {
  id: number;
  jobId: number;
  referralTitle: string;
  applicantId: number;
  applicantName: string;
  status: string;
  createdAt: string;
  jobReferrerId?: number; // Add referrer ID
  referrerName?: string; // Add referrer name
  referrerDesignation?: string; // Add referrer designation
}

interface Referrer {
  userId: number;
  userName: string;
  designation: string;
  numApplicationsAccepted: number;
  feedbackScore: number;
  overallScore: number;
}

export default function ReferralDetails() {
  // console.log('ReferralDetails page loaded');
  const params = useParams();
  const { isLoggedIn } = useAuth();
  // console.log('ReferralDetails isLoggedIn:', isLoggedIn);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [currencies, setCurrencies] = useState<{ [key: number]: string }>({});
  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [selectedReferrerId, setSelectedReferrerId] = useState<number | null>(null);
  const [showReferrerModal, setShowReferrerModal] = useState(false);
  const [appliedReferrer, setAppliedReferrer] = useState<{ id: number; name: string; designation: string } | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [showSwitchReferrerModal, setShowSwitchReferrerModal] = useState(false);
  const [isSwitchingReferrer, setIsSwitchingReferrer] = useState(false);

  // Login modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingApplication, setPendingApplication] = useState(false);

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

  const fetchApplicationStatus = useCallback(async () => {
    if (!isLoggedIn) {
      console.log('User not logged in, skipping application status fetch');
      return null; // Don't fetch if user is not logged in
    }

    try {
      setIsCheckingApplication(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        console.log('No auth token found for application status fetch');
        return null;
      }

      console.log('Fetching application status for job ID:', params.id);
      const response = await fetch(`${BASE_URL}/api/v1/my-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application status');
      }

      const data: Application[] = await response.json();
      console.log('All applications:', data);
      console.log('Looking for job ID:', Number(params.id));

            const application = data.find(app => app.jobId === Number(params.id));
      console.log('Found application:', application);
      console.log('Application status:', application?.status);

            const status = application ? application.status : null;
      setApplicationStatus(status);
      setApplicationId(application ? application.id : null);

            console.log('Setting applicationStatus to:', status);

      // If user has applied and we have referrer information, set the applied referrer
      if (application?.jobReferrerId) {
        // Find the referrer details from the referrers list
        const referrer = referrers.find(ref => ref.userId === application.jobReferrerId);
        if (referrer) {
          setAppliedReferrer({
            id: referrer.userId,
            name: referrer.userName,
            designation: referrer.designation
          });
        } else {
          console.log('Referrer not found in list yet, will set later when referrers are loaded');
        }
      }

      return status;

    } catch (error) {
      console.error('Error fetching application status:', error);
      // Don't show error toast for this as it might be expected for non-logged in users
    } finally {
      setIsCheckingApplication(false);
    }
  }, [isLoggedIn, params.id, referrers]);

  const fetchReferralDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/jobsearch/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch referral details');
      }
      const data = await response.json();
      setReferral(data);
    } catch (error) {
      toast.error('Failed to fetch referral details');
      console.error('Error fetching referral details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  const fetchReferrers = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/jobsearch/${params.id}/referrers`);
      if (!response.ok) {
        throw new Error('Failed to fetch referrers');
      }
      const data: Referrer[] = await response.json();
      setReferrers(data);

      // If there's only one referrer, auto-select it
      if (data.length === 1) {
        setSelectedReferrerId(data[0].userId);
      }
    } catch (error) {
      console.error('Error fetching referrers:', error);
      // Don't show error toast as this might be expected for some jobs
    }
  }, [params.id]);

  useEffect(() => {
    fetchCurrencies();
    fetchLocations();
    fetchReferralDetails();
    fetchReferrers();
  }, [fetchReferralDetails, fetchReferrers]);

  // Separate useEffect for fetchApplicationStatus to run after referrers are loaded
  useEffect(() => {
    if (isLoggedIn) {
      fetchApplicationStatus();
    }
  }, [params.id, isLoggedIn, fetchApplicationStatus]);

  // Set applied referrer once referrers are loaded and we have application data
  useEffect(() => {
    if (referrers.length > 0 && applicationId && !appliedReferrer) {
      // Re-fetch application status to get the latest data and set applied referrer
      fetchApplicationStatus();
    }
  }, [referrers, applicationId, fetchApplicationStatus, appliedReferrer]);

  // Debug: Monitor applicationStatus changes
  useEffect(() => {
    console.log('applicationStatus changed to:', applicationStatus);
  }, [applicationStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

    const formatSalaryRange = (minSalary: number, maxSalary: number, currencyId: number) => {
    const currency = currencies[currencyId] || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });

    if (minSalary === maxSalary) {
      return formatter.format(minSalary);
    }

    return `${formatter.format(minSalary)} - ${formatter.format(maxSalary)}`;
  };

  const handleApply = useCallback(async (forceApply: boolean = false, referrerId?: number) => {
    console.log('handleApply called, applicationStatus:', applicationStatus, 'forceApply:', forceApply, 'referrerId:', referrerId);
    // Don't proceed if already applied, unless forceApply is true
    if (applicationStatus && !forceApply) {
      console.log('Already applied, returning early');
      return;
    }

    if (!isLoggedIn) {
      setPendingApplication(true);
      setShowLoginModal(true);
      return;
    }

    // Reset pending application state since we're now proceeding with the application
    setPendingApplication(false);

    // Use the passed referrerId or fall back to selectedReferrerId
    const targetReferrerId = referrerId || selectedReferrerId;

    // If there are multiple referrers and none is selected, show the modal
    if (referrers.length > 1 && !targetReferrerId) {
      setShowReferrerModal(true);
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
          coverLetter: 'test',
          jobReferrerId: targetReferrerId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to apply for referral');
      }

      toast.success('Successfully applied for the referral!');
      // Refresh application status after successful application
      setApplicationStatus('Applied');

      // Set the applied referrer
      if (targetReferrerId) {
        const referrer = referrers.find(ref => ref.userId === targetReferrerId);
        if (referrer) {
          setAppliedReferrer({
            id: referrer.userId,
            name: referrer.userName,
            designation: referrer.designation
          });
        }
      }

      setShowReferrerModal(false);
    } catch (error) {
      console.error('Error applying for referral:', error);
      toast.error('Failed to apply for referral');
    }
  }, [applicationStatus, isLoggedIn, selectedReferrerId, referrers, params.id]);

  // Handle pending application after successful login
  useEffect(() => {
    if (isLoggedIn && pendingApplication) {
      console.log('Auth state updated, proceeding with application');
      // Small delay to ensure all auth state is properly set
      const timer = setTimeout(async () => {
        // Check application status again before proceeding
        const status = await fetchApplicationStatus();
        console.log('Fetched status before applying:', status);

        // Only proceed if user hasn't already applied
        if (!status) {
          handleApply();
        } else {
          console.log('User already applied, not proceeding with application');
          setPendingApplication(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fetchApplicationStatus, handleApply, isLoggedIn, pendingApplication]);

  const handleLoginSuccess = () => {
    console.log('Login successful');
    setShowLoginModal(false);
    // Don't set pendingApplication = false here
    // Let the useEffect handle it after the application is triggered
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    setPendingApplication(false);
  };

  const handleReferrerSelect = (referrerId: number) => {
    setSelectedReferrerId(referrerId);
    setShowReferrerModal(false);
    // Automatically apply after selecting referrer
    // Pass the referrerId directly to avoid state timing issues
    handleApply(true, referrerId);
  };

  const handleSwitchReferrer = async (newReferrerId: number) => {
    if (!applicationId) {
      toast.error('Application ID not found');
      return;
    }

    try {
      setIsSwitchingReferrer(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/my-applications/switch-referrer?applicationId=${applicationId}&newJobReferrerId=${newReferrerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to switch referrer');
      }

      toast.success('Successfully switched referrer!');

      // Update the applied referrer
      const newReferrer = referrers.find(ref => ref.userId === newReferrerId);
      if (newReferrer) {
        setAppliedReferrer({
          id: newReferrer.userId,
          name: newReferrer.userName,
          designation: newReferrer.designation
        });
      }

      setShowSwitchReferrerModal(false);
    } catch (error) {
      console.error('Error switching referrer:', error);
      toast.error('Failed to switch referrer');
    } finally {
      setIsSwitchingReferrer(false);
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

  if (!referral) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Referral not found</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fafd] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-left">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-left">{referral.title}</h1>
            <div className="text-base text-gray-500 font-medium mb-2 text-left">{referral.company}</div>
            <div className="flex items-center text-xs text-gray-400 mb-1 text-left">
              <span>Posted on {formatDate(referral.createdAt)}</span>
            </div>
            <hr className="my-4 border-gray-200" />
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Experience</div>
              <div className="text-base font-semibold text-gray-800">
                {referral.minExperience && referral.maxExperience
                  ? `${referral.minExperience} - ${referral.maxExperience} yrs`
                  : referral.minExperience
                  ? `${referral.minExperience}+ yrs`
                  : referral.maxExperience
                  ? `Up to ${referral.maxExperience} yrs`
                  : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Monthly Salary</div>
              <div className="text-base font-semibold text-gray-800">
                {formatSalaryRange(referral.minSalary, referral.maxSalary, referral.currencyId)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Job Location</div>
              <div className="text-base font-semibold text-gray-800">
                {locations[referral.cityId]?.city}, {locations[referral.cityId]?.country}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Vacancy</div>
              <div className="text-base font-semibold text-gray-800">{referral.openingCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Designation</div>
              <div className="text-base font-semibold text-gray-800">{referral.designation || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Job Type</div>
              <div className="text-base font-semibold text-gray-800">{referral.jobType || 'Not specified'}</div>
            </div>
          </div>
          <hr className="my-4 border-gray-200" />

          {/* Job Description Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-left">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-left" dangerouslySetInnerHTML={{ __html: referral.description }} />
          </div>

          <hr className="my-4 border-gray-200" />



          {/* Keywords as pills above the apply button */}
          {referral.tags && referral.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2 text-left">Keywords</h3>
              <div className="flex flex-wrap gap-3 justify-start text-left">
                {referral.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold min-h-[2.25rem] flex items-center"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}


          <hr className="my-4 border-gray-200" />

          {/* Application Status & Button */}
          <div className="mt-8">
            {isLoggedIn && applicationStatus && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    You have already applied for this referral - Status: {applicationStatus}
                  </span>
                </div>
                {appliedReferrer && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium mb-2">Applied with:</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-xs">
                            {appliedReferrer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">{appliedReferrer.name}</p>
                          <p className="text-xs text-green-700">{appliedReferrer.designation}</p>
                        </div>
                      </div>
                      {applicationStatus === 'PENDING' && referrers.length > 1 && (
                        <button
                          onClick={() => setShowSwitchReferrerModal(true)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Switch Referrer
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => handleApply()}
              disabled={!!applicationStatus || isCheckingApplication}
              className={`w-full mt-2 px-6 py-3 rounded-lg shadow font-semibold text-lg transition duration-200 ${
                !!applicationStatus
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1a73e8] text-white hover:bg-[#1666c1]'
              }`}
            >
              {isCheckingApplication ? 'Checking...' : applicationStatus ? 'Applied' : 'Easy Apply'}
            </button>
          </div>

          {/* Referrer Information */}
          {referrers.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-base font-semibold text-blue-900 mb-3">
                Available Referrers ({referrers.length})
              </h3>
              <div className="space-y-3">
                {referrers.map((referrer) => (
                  <div key={referrer.userId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {referrer.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{referrer.userName}</p>
                          <p className="text-sm text-gray-600">{referrer.designation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Score: {referrer.overallScore.toFixed(1)}</span>
                        <span>•</span>
                        <span>{referrer.numApplicationsAccepted} accepted</span>
                      </div>
                      {appliedReferrer && appliedReferrer.id === referrer.userId && (
                        <span className="text-green-600 text-sm font-medium">Applied with</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {referrers.length > 1 && !applicationStatus && (
                <p className="text-sm text-blue-700 mt-3">
                  💡 Multiple referrers available. You&apos;ll be able to choose one when applying.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Referrer Selection Modal */}
      {showReferrerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Choose a Referrer</h3>
            <p className="text-gray-600 mb-4">
              Select a referrer who will help you with this application:
            </p>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {referrers.map((referrer) => (
                <button
                  key={referrer.userId}
                  onClick={() => handleReferrerSelect(referrer.userId)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">
                        {referrer.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{referrer.userName}</p>
                      <p className="text-sm text-gray-600">{referrer.designation}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Score: {referrer.overallScore.toFixed(1)}</div>
                      <div>{referrer.numApplicationsAccepted} accepted</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowReferrerModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Referrer Modal */}
      {showSwitchReferrerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Switch Referrer</h3>
            <p className="text-gray-600 mb-4">
              Choose a different referrer for your application:
            </p>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {referrers.map((referrer) => (
                <button
                  key={referrer.userId}
                  onClick={() => handleSwitchReferrer(referrer.userId)}
                  disabled={isSwitchingReferrer || appliedReferrer?.id === referrer.userId}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    appliedReferrer?.id === referrer.userId
                      ? 'border-green-300 bg-green-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">
                        {referrer.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{referrer.userName}</p>
                      <p className="text-sm text-gray-600">{referrer.designation}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Score: {referrer.overallScore.toFixed(1)}</div>
                      <div>{referrer.numApplicationsAccepted} accepted</div>
                      {appliedReferrer?.id === referrer.userId && (
                        <div className="text-green-600 font-medium">Current</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSwitchReferrerModal(false)}
                disabled={isSwitchingReferrer}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoginForm
            isModal={true}
            title="Login to Apply"
            subtitle="Please log in to apply for this referral opportunity."
            onSuccess={handleLoginSuccess}
            onCancel={handleLoginCancel}
            showLinks={true}
          />
        </div>
      )}
    </main>
  );
}