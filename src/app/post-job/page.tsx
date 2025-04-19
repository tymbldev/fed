'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function PostJob() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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
      'currentSalary',
      'currentSalaryCurrencyId',
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
        currentSalary: formData.currentSalary ? parseFloat(formData.currentSalary) : undefined,
        currentSalaryCurrencyId: formData.currentSalaryCurrencyId ? parseInt(formData.currentSalaryCurrencyId) : undefined,
        skillNames: formData.skillNames ? formData.skillNames.split(',').map(skill => skill.trim()) : [],
        company: userProfile?.company,
      };

      const response = await fetch(`${BASE_URL}/api/v1/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('auth_token=')[1]?.split(';')[0]}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to post job');
      }

      toast.success('Job posted successfully!');
      router.push('/my-jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Post a Job</h1>
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
          onBlur={() => handleBlur('salary')}
          required={true}
          currencyLabel="Select Currency"
          salaryLabel="Annual Salary"
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
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}