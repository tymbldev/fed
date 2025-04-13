'use client';

import React, { useState, useEffect } from 'react';
import { registerConfig } from '../config/registerConfig';
import { updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

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
        designation: userProfile.positionDisplay || '',
        department: userProfile.departmentDisplay || '',
        city: userProfile.cityId?.toString() || '',
        country: userProfile.countryId?.toString() || '',
        yearsOfExperience: userProfile.yearsOfExperience?.toString() || '',
        skillIds: userProfile.skillIds?.join(', ') || '',
        company: userProfile.company || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
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

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        designationId: undefined,
        departmentId: formData.department ? parseInt(formData.department) : undefined,
        countryId: formData.country ? parseInt(formData.country) : undefined,
        stateId: formData.state ? parseInt(formData.state) : undefined,
        cityId: formData.city ? parseInt(formData.city) : undefined,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        skillIds: formData.skillIds ? formData.skillIds.split(',').map(skill => skill.trim()) : [],
        company: formData.company,
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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${styles.heading.gradient}`}>
            Profile
          </h2>
          <p className="mt-2 text-gray-600">
            View and update your profile information
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FirstName
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <LastName
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <Email
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <Phone
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <Company
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <Designation
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <Department
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <Location
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
              <div className="col-span-1 md:col-span-2">
                <Skills
                  formData={formData}
                  errors={errors}
                  touched={touched}
                  onInputChange={handleInputChange}
                  onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
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