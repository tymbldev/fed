'use client';

import React, { useState } from 'react';
import { registerUser, updateProfile } from '../services/api';
import { toast } from 'sonner';
import Email from '../components/fields/Email';
import Password from '../components/fields/Password';
import FirstName from '../components/fields/FirstName';
import LastName from '../components/fields/LastName';
import Phone from '../components/fields/Phone';
import Location from '../components/fields/Location';
import Department from '../components/fields/Department';
import Company from '../components/fields/Company';
import Designation from '../components/fields/Designation';
import Skills from '../components/fields/Skills';
import TotalWorkExperience from '../components/fields/TotalWorkExperience';
import Salary from '../components/fields/Salary';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateFields } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

type FormData = { [key: string]: string };
type FormErrors = { [key: string]: string };
type FormTouched = { [key: string]: boolean };

type ProfileData = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  designationId?: number;
  departmentId?: number;
  cityId?: number;
  countryId?: number;
  yearsOfExperience?: number;
  monthsOfExperience?: number;
  skillNames?: string | string[];
  [key: string]: string | number | string[] | undefined;
};

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUserProfile } = useAuth();

  // Initialize step from URL parameters
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get('step');
    return step ? Math.min(Math.max(1, parseInt(step)), 4) : 1;
  });

  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update URL with only step number
  const updateStepInUrl = (step: number) => {
    const params = new URLSearchParams();
    params.set('step', step.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field] || '';
    const fieldsToValidate = [{ name: field, value, required: true }];
    const newErrors = validateFields(fieldsToValidate);
    if (newErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Define fields to validate for each step
      const stepFields = {
        1: ['email', 'password'],
        2: ['firstName', 'lastName', 'phone', 'countryId', 'cityId'],
        3: ['yearsOfExperience', 'monthsOfExperience', 'company', 'designation', 'departmentId'],
        4: ['currentSalary', 'currentSalaryCurrencyId', 'skillNames']
      };

      // Validate fields for the current step
      const currentStepFields = stepFields[currentStep as keyof typeof stepFields] || [];
      const fieldsToValidate = currentStepFields.map(field => ({
        name: field,
        value: formData[field] || '',
        required: true
      }));

      const stepErrors = validateFields(fieldsToValidate);
      const hasErrors = Object.keys(stepErrors).length > 0;

      if (hasErrors) {
        setErrors(prev => ({ ...prev, ...stepErrors }));
        // Mark all fields as touched to show errors
        const touchedFields = currentStepFields.reduce((acc, field) => ({
          ...acc,
          [field]: true
        }), {});
        setTouched(prev => ({ ...prev, ...touchedFields }));
        setIsSubmitting(false);
        return;
      }

      if (currentStep === 1) {
        const { email, password } = formData;
        await registerUser(email, password);
        toast.success('Account created successfully!');
        const nextStep = 2;
        setCurrentStep(nextStep);
        updateStepInUrl(nextStep);
      } else {
        const profileData = { ...formData };
        delete profileData.password; // Remove password from profile update
        // Map phone to phoneNumber for API
        if (profileData.phone) {
          profileData.phoneNumber = profileData.phone;
          delete profileData.phone;
        }

        // Create API data object
        const apiData: ProfileData = { ...profileData };
        // Convert skillNames string to array for API
        if (apiData.skillNames && typeof apiData.skillNames === 'string') {
          apiData.skillNames = apiData.skillNames.split(',').map((skill: string) => skill.trim());
        }
        await updateProfile(apiData);
        await fetchUserProfile(); // Fetch fresh profile data

        if (currentStep === 4) {
          toast.success('Profile completed successfully!');
          router.push('/profile');
        } else {
          toast.success('Information saved successfully!');
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          updateStepInUrl(nextStep);
        }
      }
    } catch (err) {
      console.error('Operation failed:', err);
      toast.error(currentStep === 1 ? 'Registration failed. Please try again.' : 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    updateStepInUrl(prevStep);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Email
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Password
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <FirstName
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <LastName
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Phone
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Location
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <TotalWorkExperience
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Company
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Designation
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Department
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <Salary
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
            <Skills
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
        Create Account
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Step {currentStep} of 4
      </p>

      <div className="h-1 w-full bg-gray-200 rounded-full mb-8">
        <div
          className="h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      <form onSubmit={handleStepSubmit} className="space-y-8" noValidate>
        {renderStepContent()}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? currentStep === 4
                ? 'Completing Setup...'
                : 'Saving...'
              : currentStep === 4
                ? 'Complete Setup'
                : 'Save & Continue'
            }
          </button>
        </div>
      </form>

      <p className="text-center mt-8 text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}