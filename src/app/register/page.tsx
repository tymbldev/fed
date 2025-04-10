'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InputField from '../components/fields/InputField';
import SelectField from '../components/fields/SelectField';
import PasswordField from '../components/fields/PasswordField';
import { registerConfig } from '../config/registerConfig';
import { registerUser, updateProfile } from '../services/api';
import { toast } from 'sonner';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fields, options, styles, steps, errorMessages } = registerConfig;

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['email', 'password'];
      case 2:
        return ['firstName', 'lastName', 'role'];
      case 3:
        return ['phone', 'company', 'designation'];
      case 4:
        return ['department', 'city', 'country', 'zipCode'];
      default:
        return [];
    }
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};
    const stepFields = getFieldsForStep(step);

    stepFields.forEach(fieldName => {
      const field = fields[fieldName as keyof typeof fields];
      const value = formData[fieldName]?.trim();

      // Check required fields
      if ('required' in field && field.required && !value) {
        const errorMessage = errorMessages[fieldName as keyof typeof errorMessages];
        newErrors[fieldName] = typeof errorMessage === 'object' && 'required' in errorMessage
          ? errorMessage.required
          : errorMessages.required;
        return; // Skip further validation if field is empty
      }

      // Only validate if there's a value
      if (value) {
        switch (fieldName) {
          case 'email':
            if (!/\S+@\S+\.\S+/.test(value)) {
              newErrors[fieldName] = errorMessages.email.format;
            }
            break;

          case 'password':
            if (value.length < 6) {
              newErrors[fieldName] = errorMessages.password.minLength;
            } else {
              delete newErrors[fieldName];
            }
            break;

          case 'phone':
            if (!/^\+?[\d\s-]{10,}$/.test(value)) {
              newErrors[fieldName] = errorMessages.phone.format;
            }
            break;

          case 'zipCode':
            if (!/^\d{5}(-\d{4})?$/.test(value)) {
              newErrors[fieldName] = errorMessages.zipCode.format;
            }
            break;
        }
      }
    });

    return newErrors; // Return errors instead of setting them directly
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    const stepErrors = validateStep(currentStep);
    setErrors(prev => ({
      ...prev,
      [name]: stepErrors[name]
    }));
  };

  const handleStep1Submit = async () => {
    try {
      setIsSubmitting(true);
      await registerUser(formData['email'], formData['password']);
      setCurrentStep(2);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async (step: number) => {
    try {
      setIsSubmitting(true);
      const profileData: any = {};

      // Add fields based on current step
      if (step >= 2) {
        profileData.firstName = formData['firstName'];
        profileData.lastName = formData['lastName'];
        profileData.role = formData['role'];
      }
      if (step >= 3) {
        profileData.phoneNumber = formData['phone'];
        profileData.company = formData['company'];
        profileData.designationId = parseInt(formData['designation']);
      }
      if (step >= 4) {
        profileData.departmentId = parseInt(formData['department']);
        profileData.cityId = parseInt(formData['city']);
        profileData.countryId = parseInt(formData['country']);
        profileData.yearsOfExperience = 0;
        profileData.skills = [];
      }

      await updateProfile(profileData);
    } catch (error) {
      setErrors({ general: 'Profile update failed. Please try again.' });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const newErrors = validateStep(currentStep);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (currentStep === 1) {
          await handleStep1Submit();
        } else {
          await handleProfileUpdate(currentStep);
          setCurrentStep(currentStep + 1);
        }
      } catch (error) {
        // Error is already handled in the respective functions
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStep(currentStep);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <InputField
              {...fields.email}
              value={formData['email'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              error={touched['email'] ? errors['email'] : undefined}
            />
            <PasswordField
              {...fields.password}
              value={formData['password'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              error={touched['password'] ? errors['password'] : undefined}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className={styles.button.primary}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Next'}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <InputField
              {...fields.firstName}
              value={formData['firstName'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('firstName')}
              error={touched['firstName'] ? errors['firstName'] : undefined}
            />
            <InputField
              {...fields.lastName}
              value={formData['lastName'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('lastName')}
              error={touched['lastName'] ? errors['lastName'] : undefined}
            />
            <SelectField
              {...fields.role}
              options={options.role}
              value={formData['role'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('role')}
              error={touched['role'] ? errors['role'] : undefined}
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className={styles.button.secondary}
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className={styles.button.primary}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Next'}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <InputField
              {...fields.phone}
              value={formData['phone'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('phone')}
              error={touched['phone'] ? errors['phone'] : undefined}
            />
            <InputField
              {...fields.company}
              value={formData['company'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('company')}
              error={touched['company'] ? errors['company'] : undefined}
            />
            <SelectField
              {...fields.designation}
              options={options.designation}
              value={formData['designation'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('designation')}
              error={touched['designation'] ? errors['designation'] : undefined}
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className={styles.button.secondary}
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className={styles.button.primary}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Next'}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <SelectField
              {...fields.department}
              options={options.department}
              value={formData['department'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('department')}
              error={touched['department'] ? errors['department'] : undefined}
            />
            <SelectField
              {...fields.city}
              options={options.city}
              value={formData['city'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('city')}
              error={touched['city'] ? errors['city'] : undefined}
            />
            <SelectField
              {...fields.country}
              options={options.country}
              value={formData['country'] || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('country')}
              error={touched['country'] ? errors['country'] : undefined}
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className={styles.button.secondary}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.button.primary}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Create Account'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${styles.heading.gradient}`}>
            Create Account
          </h2>
          <p className="mt-2 text-gray-600">
            Step {currentStep} of {steps.total} - {steps.labels[currentStep as keyof typeof steps.labels]}
          </p>
        </div>

        <div className="relative">
          <div className={`absolute top-0 left-0 h-1 ${styles.progressBar.container} w-full rounded-full`}></div>
          <div
            className={`absolute top-0 left-0 h-1 ${styles.progressBar.background} rounded-full transition-all duration-300`}
            style={{ width: `${(currentStep / steps.total) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderStep()}
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#1a73e8] hover:text-[#1a73e8]/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}