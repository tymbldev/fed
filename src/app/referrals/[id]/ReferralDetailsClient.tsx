'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import { Referral, Referrer } from '../../utils/serverData';
import { SWITCH_CONFIG } from '../../config/switchConfig';

interface ReferralDetailsClientProps {
  referral: Referral;
  referrers: Referrer[];
  initialApplicationStatus: string | null;
  initialApplicationId: number | null;
  initialAppliedReferrer: { id: number; name: string; designation: string } | null;
  applicationCreatedAt: string | null;
}

export default function ReferralDetailsClient({
  referral,
  referrers,
  initialApplicationStatus,
  initialApplicationId,
  initialAppliedReferrer,
  applicationCreatedAt
}: ReferralDetailsClientProps) {
  const { isLoggedIn } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<string | null>(initialApplicationStatus);
  const [applicationId] = useState<number | null>(initialApplicationId);
  const [appliedReferrer, setAppliedReferrer] = useState<{ id: number; name: string; designation: string } | null>(initialAppliedReferrer);
  const [selectedReferrerId, setSelectedReferrerId] = useState<number | null>(null);
  const [showReferrerModal, setShowReferrerModal] = useState(false);
  const [showSwitchReferrerModal, setShowSwitchReferrerModal] = useState(false);
  const [isSwitchingReferrer, setIsSwitchingReferrer] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingApplication, setPendingApplication] = useState(false);
        const [showSwitchOption, setShowSwitchOption] = useState(false);

  // Check if we should show the switch referrer option based on application date
  // The switch option becomes available after a configurable number of days (default: 3 days)
  useEffect(() => {
    if (applicationCreatedAt) {
      const appliedDate = new Date(applicationCreatedAt);
      const currentDate = new Date();
      const daysDifference = Math.floor((currentDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));

      console.log("daysDifference", daysDifference);

      if (daysDifference >= SWITCH_CONFIG.SHOW_APPLIED_DATE_AFTER_DAYS) {
        setShowSwitchOption(true);
      }
    }
  }, [applicationCreatedAt]);

  // Auto-select referrer if only one available
  useEffect(() => {
    if (referrers.length === 1) {
      setSelectedReferrerId(referrers[0].userId);
    }
  }, [referrers]);

  const handleApply = useCallback(async (forceApply: boolean = false, referrerId?: number) => {
    if (applicationStatus && !forceApply) {
      return;
    }

    if (!isLoggedIn) {
      setPendingApplication(true);
      setShowLoginModal(true);
      return;
    }

    setPendingApplication(false);
    const targetReferrerId = referrerId || selectedReferrerId;

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
          jobId: referral.id,
          coverLetter: 'test',
          jobReferrerId: targetReferrerId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to apply for referral');
      }

      toast.success('Successfully applied for the referral!');
      const data = await response.json();
      console.log(data);
      setApplicationStatus('Applied');

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
  }, [applicationStatus, isLoggedIn, selectedReferrerId, referrers, referral.id]);

  useEffect(() => {
    if (isLoggedIn && pendingApplication) {
      const timer = setTimeout(async () => {
        if (!applicationStatus) {
          handleApply();
        } else {
          setPendingApplication(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [handleApply, isLoggedIn, pendingApplication, applicationStatus]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    setPendingApplication(false);
  };

  const handleReferrerSelect = (referrerId: number) => {
    setSelectedReferrerId(referrerId);
    setShowReferrerModal(false);
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

  return (
    <>
      {/* Application Status & Button */}
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
                  {applicationStatus === 'PENDING' && referrers.length > 1 && showSwitchOption && (
                    <button
                      onClick={() => setShowSwitchReferrerModal(true)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Switch Referrer
                    </button>
                  )}
                </div>
                {applicationStatus === 'PENDING' && referrers.length > 1 && !showSwitchOption && applicationCreatedAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Switch referrer option will be available after {SWITCH_CONFIG.SHOW_APPLIED_DATE_AFTER_DAYS} days from application date
                  </div>
                )}
              </div>
            )}
        </div>
      )}

      <button
        onClick={() => handleApply()}
        disabled={!!applicationStatus}
        className={`w-full mt-2 px-6 py-3 rounded-lg shadow font-semibold text-lg transition duration-200 ${
          !!applicationStatus
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#1a73e8] text-white hover:bg-[#1666c1]'
        }`}
      >
        {applicationStatus ? 'Referral Sent' : 'Send referral'}
      </button>

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
                      <p className="font-medium text-gray-900">{referrer.designation}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
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
            title="Login to Send Referral"
            subtitle="Please log in to apply for this referral opportunity."
            onSuccess={handleLoginSuccess}
            onCancel={handleLoginCancel}
            showLinks={true}
          />
        </div>
      )}
    </>
  );
}