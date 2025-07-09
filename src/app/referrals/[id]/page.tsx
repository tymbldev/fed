'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
  const { userProfile, isLoggedIn } = useAuth();
  console.log('ReferralDetails isLoggedIn:', isLoggedIn);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [currencies, setCurrencies] = useState<{ [key: number]: string }>({});
  const [locations, setLocations] = useState<{ [key: number]: LocationOption }>({});
  const [designations, setDesignations] = useState<{ [key: number]: string }>({});
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
      setApplicationId(application ? application.id : null);

      // If user has applied and we have referrer information, set the applied referrer
      if (application && application.jobReferrerId) {
        // Find the referrer details from the referrers list
        const referrer = referrers.find(ref => ref.userId === application.jobReferrerId);
        if (referrer) {
          setAppliedReferrer({
            id: referrer.userId,
            name: referrer.userName,
            designation: referrer.designation
          });
        }
      }
    } catch (error) {
      console.error('Error fetching application status:', error);
      // Don't show error toast for this as it might be expected for non-logged in users
    } finally {
      setIsCheckingApplication(false);
    }
  };

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
    fetchDesignations();
    fetchReferralDetails();
    fetchReferrers();
  }, [fetchReferralDetails, fetchReferrers]);

  // Separate useEffect for fetchApplicationStatus to run after referrers are loaded
  useEffect(() => {
    if (referrers.length > 0) {
      fetchApplicationStatus();
    }
  }, [referrers, params.id, isLoggedIn]);

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
      toast.error('Please login to apply for referrals');
      return;
    }

    if (applicationStatus) {
      toast.error('You have already applied for this referral');
      return;
    }

    // If there are multiple referrers and none is selected, show the modal
    if (referrers.length > 1 && !selectedReferrerId) {
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
          jobReferrerId: selectedReferrerId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to apply for referral');
      }

      toast.success('Successfully applied for the referral!');
      // Refresh application status after successful application
      setApplicationStatus('Applied');

      // Set the applied referrer
      if (selectedReferrerId) {
        const referrer = referrers.find(ref => ref.userId === selectedReferrerId);
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
  };

  const handleReferrerSelect = (referrerId: number) => {
    setSelectedReferrerId(referrerId);
    setShowReferrerModal(false);
    // Automatically apply after selecting referrer
    setTimeout(() => {
      handleApply();
    }, 100);
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
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{referral.title}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xl">{referral.company}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xl">
                {locations[referral.cityId]?.city}, {locations[referral.cityId]?.country}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl">{formatSalary(referral.salary, referral.currencyId)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Posted on {formatDate(referral.createdAt)}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Referral Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Designation:</span> {designations[referral.designationId] || 'Not specified'}</p>
                <p><span className="font-medium">Status:</span> {referral.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Referral Description</h2>
            <div className="whitespace-pre-wrap text-gray-700" dangerouslySetInnerHTML={{ __html: referral.description }} />
          </div>

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

            {!isLoggedIn && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  💡 Please <a href="/login" className="underline font-medium">log in</a> to apply for this referral.
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
              {isCheckingApplication ? 'Checking...' : applicationStatus ? 'Applied' : 'Apply Now'}
            </button>

            {/* Referrer Information */}
            {referrers.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
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
                        {selectedReferrerId === referrer.userId && !applicationStatus && (
                          <span className="text-blue-600 text-sm font-medium">Selected</span>
                        )}
                        {appliedReferrer && appliedReferrer.id === referrer.userId && (
                          <span className="text-green-600 text-sm font-medium">Applied with</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {referrers.length > 1 && (
                  <p className="text-sm text-blue-700 mt-3">
                    💡 Multiple referrers available. You&apos;ll be able to choose one when applying.
                  </p>
                )}
              </div>
            )}
          </div>
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
    </main>
  );
}