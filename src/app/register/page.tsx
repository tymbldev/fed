'use client';

import React, { useState, Suspense } from 'react';
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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUserProfile, isLoggedIn, checkAuthState } = useAuth();
  const [hasJustRegistered, setHasJustRegistered] = useState(false);
  const isInitialLoad = React.useRef(true);

  // Redirect if user is already logged in (but not if they just registered or on initial load)
  React.useEffect(() => {
    if (isLoggedIn && !hasJustRegistered && !isInitialLoad.current) {
      toast.info('You are already logged in');
      router.push('/profile');
    }
    isInitialLoad.current = false;
  }, [isLoggedIn, router, hasJustRegistered]);

  // Initialize step from URL parameters
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get('step');
    return step ? Math.min(Math.max(1, parseInt(step)), 4) : 1;
  });

  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top with smooth animation when step changes
  React.useEffect(() => {
    if (!isInitialLoad.current) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

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
        setHasJustRegistered(true); // Set this before registration to prevent the toast
        await registerUser(email, password);
        // Check and update auth state after successful registration
        await checkAuthState();
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

        // Convert skillNames string to array for API
        if (apiData.skillIds && typeof apiData.skillIds === 'string') {
          apiData.skillIds = apiData.skillIds.split(',').map((skill: string) => skill.trim());
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
    } catch (err: unknown) {
      console.error('Operation failed:', err);
      if (err instanceof Error) {
        toast.error(err.message);
      }
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
          <div className="space-y-6 animate-fade-in">
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
          <div className="space-y-6 animate-fade-in">
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
              onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              required={true}
              layout="horizontal"
              countryLabel="Preferred Country"
              cityLabel="Preferred City"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
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
          <div className="space-y-6 animate-fade-in">
            <div className="w-full">
              <Skills
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
                label="Key Skills"
              />
            </div>
            <div className="w-full">
              <Salary
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
                currencyLabel="Select Currency"
                salaryLabel="Annual Salary"
                salaryFieldName="currentSalary"
                currencyFieldName="currentSalaryCurrencyId"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text">
            Create Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Step {currentStep} of 4
          </p>

          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
            <div
              className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 rounded-full transition-all duration-300"
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
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary ml-auto"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentStep === 4 ? 'Completing Setup...' : 'Saving...'}
                  </div>
                ) : (
                  currentStep === 4 ? 'Complete Setup' : 'Save & Continue'
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterForm />
    </Suspense>
  );
}