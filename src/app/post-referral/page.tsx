'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { validateFields } from '../utils/validation';
import { BASE_URL } from '../services/api';

// Import field components
import Designation from '../components/fields/Designation';
import Description from '../components/fields/Description';
import Location from '../components/fields/Location';
import Salary from '../components/fields/Salary';
import Skills from '../components/fields/Skills';
import OpeningCount from '../components/fields/OpeningCount';
import UniqueUrl from '../components/fields/UniqueUrl';
import Platform from '../components/fields/Platform';

function PostReferralForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictJobId, setConflictJobId] = useState<string | null>(null);

  const isEditMode = searchParams.get('edit') === 'true';
  const referralId = searchParams.get('id');

  useEffect(() => {
    const fetchReferralDetails = async () => {
      if (isEditMode && referralId) {
        setIsLoading(true);
        try {
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1];

          const response = await fetch(`${BASE_URL}/api/v1/jobsearch/${referralId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch referral details');
          }

          const referral = await response.json();
          setFormData({
            title: referral.title || '',
            description: referral.description || '',
            designation: referral.designation || '',
            designationId: referral.designationId?.toString() || '',
            countryId: referral.countryId?.toString() || '',
            cityId: referral.cityId?.toString() || '',
            salary: referral.salary?.toString() || '',
            currencyId: referral.currencyId?.toString() || '',
            skillNames: referral.skillNames?.join(', ') || '',
            openingCount: referral.openingCount?.toString() || '1',
            uniqueUrl: referral.uniqueUrl || '',
            platform: referral.platform || '',
            company: referral.company || userProfile?.company || '',
            companyId: referral.companyId?.toString() || '',
          });
        } catch (error) {
          console.error('Error fetching referral details:', error);
          toast.error('Failed to fetch referral details');
        } finally {
          setIsLoading(false);
        }
      } else if (!isEditMode && userProfile) {
        // Initialize form with user's company for new referrals
        setFormData(prev => ({
          ...prev,
          company: userProfile.company || '',
          companyId: userProfile.companyId?.toString() || '',
        }));
      }
    };

    fetchReferralDetails();
  }, [isEditMode, referralId, router, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => {
    let name: string;
    let value: string;

    if (typeof e === 'string') {
      // Handle direct string input from Tiptap
      name = 'description';
      value = e;
    } else {
      // Handle form input events
      name = e.target.name;
      value = e.target.value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate the field on blur
    const fieldToValidate = {
      name: field,
      value: formData[field] || '',
      required: true
    };

    const newErrors = validateFields([fieldToValidate]);
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  };

    const handleAddToReferrersList = async () => {
    if (!conflictJobId) return;

    setIsSubmitting(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const response = await fetch(`${BASE_URL}/api/v1/jobmanagement/register-referrer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: parseInt(conflictJobId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to referrers list');
      }

      toast.success('Successfully added to referrers list!');
      setShowConflictDialog(false);
      setConflictJobId(null);
      router.push('/my-referrals');
    } catch (error) {
      console.error('Error adding to referrers list:', error);
      toast.error('Failed to add to referrers list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewExistingJob = () => {
    if (!conflictJobId) return;
    setShowConflictDialog(false);
    router.push(`/referrals/${conflictJobId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched when submitting
    const allFields = [
      'title',
      'description',
      'designation',
      'designationId',
      'company',
      'companyId',
      'countryId',
      'cityId',
      'salary',
      'currencyId',
      'skillNames',
      'openingCount',
      'platform'
    ];
    const touchedFields = allFields.reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouched(prev => ({ ...prev, ...touchedFields }));

    const fieldsToValidate = allFields.map(field => ({
      name: field,
      value: formData[field] || '',
      required: true
    }));

    const newErrors = validateFields(fieldsToValidate);
    const hasErrors = Object.keys(newErrors).length > 0;

    if (hasErrors) {
      setErrors(newErrors);
      console.log(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const referralData = {
        title: formData.title,
        description: formData.description,
        countryId: formData.countryId ? parseInt(formData.countryId) : undefined,
        cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        currencyId: formData.currencyId ? parseInt(formData.currencyId) : undefined,
        skillNames: formData.skillNames ? formData.skillNames.split(',').map(skill => skill.trim()) : [],
        skillIds: formData.skillIds ? formData.skillIds.split(',').map(id => id.trim()) : [],
        company: formData.company || userProfile?.company || '',
        companyId: formData.companyId ? parseInt(formData.companyId) : (userProfile?.companyId || undefined),
        designation: formData.designation,
        designationId: formData.designationId ? parseInt(formData.designationId) : undefined,
        openingCount: formData.openingCount ? parseInt(formData.openingCount) : 1,
        uniqueUrl: formData.uniqueUrl || '',
        platform: formData.platform || ''
      };

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const url = isEditMode && referralId
        ? `${BASE_URL}/api/v1/jobmanagement/${referralId}`
        : `${BASE_URL}/api/v1/jobmanagement`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(referralData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          // Handle conflict - same job already posted
          const errorData = await response.json();
          setConflictJobId(errorData.jobId || null);
          setShowConflictDialog(true);
          return;
        }
        throw new Error(isEditMode ? 'Failed to update referral' : 'Failed to post referral');
      }

      toast.success(isEditMode ? 'Referral updated successfully!' : 'Referral posted successfully!');
      router.push('/my-referrals');
    } catch (error) {
      console.error('Error saving referral:', error);
      toast.error(isEditMode ? 'Failed to update referral. Please try again.' : 'Failed to post referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Referral' : 'Post a Referral'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Referral Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            onBlur={() => handleBlur('title')}
            required={true}
            placeholder="Enter referral title"
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${touched.title && errors.title ? 'border-red-500' : ''}`}
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <Designation
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('designationId')}
          required={true}
          label="Designation"
          fieldName="designationId"
        />

        <Description
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('description')}
          required={true}
          label="Referral Description"
        />

        <Location
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('location')}
          required={true}
          layout="horizontal"
          countryLabel="Referral Country"
          cityLabel="Referral City"
        />

        <Salary
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
          required={true}
          currencyLabel="Select Currency"
          salaryLabel="Annual Salary"
          salaryFieldName="salary"
          currencyFieldName="currencyId"
        />

        <Skills
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('skillNames')}
          required={true}
          label="Required Skills"
        />

        <div className="flex flex-col md:flex-row md:gap-4">
          <OpeningCount
            formData={formData}
            errors={errors}
            touched={touched}
            onInputChange={handleInputChange}
            onBlur={() => handleBlur('openingCount')}
            required={true}
            label="Number of Openings"
          />

          <Platform
            formData={formData}
            errors={errors}
            touched={touched}
            onInputChange={handleInputChange}
            onBlur={() => handleBlur('platform')}
            required={true}
            label="Platform"
          />
        </div>

        <UniqueUrl
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('uniqueUrl')}
          required={false}
          label="Job Posting URL"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Referral' : 'Post Referral')}
          </button>
        </div>
      </form>

      {/* Conflict Dialog */}
      {showConflictDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Job Already Posted
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Someone from your company has already posted the same job. Do you want to get added to the referrers list?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleAddToReferrersList}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Yes, Add Me to Referrers List'}
                </button>
                <button
                  onClick={handleViewExistingJob}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View Already Posted Job
                </button>
                <button
                  onClick={() => {
                    setShowConflictDialog(false);
                    setConflictJobId(null);
                  }}
                  className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  No, Thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function PostReferral() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PostReferralForm />
    </Suspense>
  );
}