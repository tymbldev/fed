'use client';

import React, { useState, useEffect } from 'react';
import { registerConfig } from '../config/registerConfig';
import { updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { validateFields } from '../utils/validation';

// Import field components
import FirstName from '../components/fields/FirstName';
import LastName from '../components/fields/LastName';
import Email from '../components/fields/Email';
import Phone from '../components/fields/Phone';
import Company from '../components/fields/Company';
import Designation from '../components/fields/Designation';
import Department from '../components/fields/Department';
import Skills from '../components/fields/Skills';
import Location from '../components/fields/Location';
import TotalWorkExperience from '../components/fields/TotalWorkExperience';
import Salary from '../components/fields/Salary';

export default function Profile() {
  const { userProfile, fetchUserProfile } = useAuth();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { styles } = registerConfig;

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phoneNumber || '',
        designation: userProfile.designation || '',
        departmentId: userProfile.departmentId?.toString() || '',
        cityId: userProfile.cityId?.toString() || '',
        countryId: userProfile.countryId?.toString() || '',
        yearsOfExperience: userProfile.yearsOfExperience?.toString() || '',
        monthsOfExperience: userProfile.monthsOfExperience?.toString() || '',
        skillNames: userProfile.skillNames?.join(', ') || '',
        company: userProfile.company || '',
        currentSalaryCurrencyId: userProfile.currentSalaryCurrencyId?.toString() || '',
        currentSalary: userProfile.currentSalary?.toString() || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // console.log(name, value);

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get all form fields that have values
    const fieldsToValidate = Object.keys(formData).map(field => ({
      name: field,
      value: formData[field] || '',
      required: true // You can customize this based on your needs
    }));

    const newErrors = validateFields(fieldsToValidate);
    const hasErrors = Object.keys(newErrors).length > 0;

    if (hasErrors) {
      setErrors(newErrors);
      // Mark only the fields with errors as touched
      const touchedFields = Object.keys(newErrors).reduce((acc, field) => ({
        ...acc,
        [field]: true
      }), {});
      setTouched(prev => ({ ...prev, ...touchedFields }));
      setIsSubmitting(false);
      return;
    }

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        designation: formData.designation,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
        countryId: formData.countryId ? parseInt(formData.countryId) : undefined,
        stateId: formData.stateId ? parseInt(formData.stateId) : undefined,
        cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        monthsOfExperience: parseInt(formData.monthsOfExperience) || 0,
        skillNames: formData.skillNames ? formData.skillNames.split(',').map(skill => skill.trim()) : [],
        company: formData.company,
        currentSalaryCurrencyId: formData.currentSalaryCurrencyId ? parseInt(formData.currentSalaryCurrencyId) : undefined,
        currentSalary: formData.currentSalary ? parseFloat(formData.currentSalary) : undefined,
      };

      await updateProfile(profileData);
      await fetchUserProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className={`text-2xl sm:text-3xl font-bold ${styles.heading.gradient}`}>
            Profile
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            View and update your profile information
          </p>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FirstName
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
              <LastName
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
              <Email
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
                disabled={true}
              />
              <Phone
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
              <Company
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
              <Designation
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
              <Department
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
              <TotalWorkExperience
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
              />
            </div>

            <div className="w-full">
              <Location
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
                layout="horizontal"
              />
            </div>

            <div className="w-full">
              <Skills
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                required={true}
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
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className={styles.button.primary}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}