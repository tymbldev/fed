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

function PostJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = searchParams.get('edit') === 'true';
  const jobId = searchParams.get('id');

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (isEditMode && jobId) {
        setIsLoading(true);
        try {
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1];

          const response = await fetch(`${BASE_URL}/api/v1/jobsearch/${jobId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch job details');
          }

          const job = await response.json();
          setFormData({
            title: job.title || '',
            description: job.description || '',
            countryId: job.countryId?.toString() || '',
            cityId: job.cityId?.toString() || '',
            salary: job.salary?.toString() || '',
            currencyId: job.currencyId?.toString() || '',
            skillNames: job.skillNames?.join(', ') || '',
          });
        } catch (error) {
          console.error('Error fetching job details:', error);
          toast.error('Failed to fetch job details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchJobDetails();
  }, [isEditMode, jobId, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched when submitting
    const allFields = [
      'title',
      'description',
      'countryId',
      'cityId',
      'salary',
      'currencyId',
      'skillNames'
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
      setIsSubmitting(false);
      return;
    }

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        countryId: formData.countryId ? parseInt(formData.countryId) : undefined,
        cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        currencyId: formData.currencyId ? parseInt(formData.currencyId) : undefined,
        skillNames: formData.skillNames ? formData.skillNames.split(',').map(skill => skill.trim()) : [],
        company: userProfile?.company,
        companyId: 1000,
        designationId: 1000
      };

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const url = isEditMode && jobId
        ? `${BASE_URL}/api/v1/jobmanagement/${jobId}`
        : `${BASE_URL}/api/v1/jobmanagement`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update job' : 'Failed to post job');
      }

      toast.success(isEditMode ? 'Job updated successfully!' : 'Job posted successfully!');
      router.push('/my-jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(isEditMode ? 'Failed to update job. Please try again.' : 'Failed to post job. Please try again.');
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
      <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Job' : 'Post a Job'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Designation
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('title')}
          required={true}
          label="Job Title"
          fieldName="title"
        />

        <Description
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('description')}
          required={true}
          label="Job Description"
        />

        <Location
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={() => handleBlur('location')}
          required={true}
          layout="horizontal"
          countryLabel="Job Country"
          cityLabel="Job City"
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Job' : 'Post Job')}
          </button>
        </div>
      </form>
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

export default function PostJob() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PostJobForm />
    </Suspense>
  );
}