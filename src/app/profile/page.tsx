'use client';

import React, { useState, useEffect } from 'react';
import { registerConfig } from '../config/registerConfig';
import { updateProfile, uploadResume, downloadResume, deleteResume } from '../services/api';
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
import PersonalWebsite from '../components/fields/PersonalWebsite';
import LinkedIn from '../components/fields/LinkedIn';
import GitHub from '../components/fields/GitHub';
import Resume from '../components/fields/Resume';

function ProfileContent() {
  const { userProfile, fetchUserProfile } = useAuth();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localResumeUrl, setLocalResumeUrl] = useState<string | null>(null);
  const { styles } = registerConfig;

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phoneNumber || '',
        designation: userProfile.designation || '',
        designationId: userProfile.designationId?.toString() || '',
        departmentId: userProfile.departmentId?.toString() || '',
        cityId: userProfile.cityId?.toString() || '',
        countryId: userProfile.countryId?.toString() || '',
        yearsOfExperience: userProfile.yearsOfExperience?.toString() || '',
        monthsOfExperience: userProfile.monthsOfExperience?.toString() || '',
        skillNames: userProfile.skillNames?.join(', ') || '',
        skillIds: userProfile.skillIds?.join(',') || '',
        company: userProfile.company || '',
        currentSalaryCurrencyId: userProfile.currentSalaryCurrencyId?.toString() || '',
        currentSalary: userProfile.currentSalary?.toString() || '',
        portfolioWebsite: userProfile.portfolioWebsite || '',
        linkedInProfile: userProfile.linkedInProfile || '',
        githubProfile: userProfile.githubProfile || '',
      });
      setLocalResumeUrl(userProfile.resume || null);
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

  const handleFileUpload = async (file: File) => {
    if (!userProfile?.id) {
      toast.error('User profile not found');
      return;
    }

    try {
      const userName = `${userProfile.firstName || ''}`.trim();
      const response = await uploadResume(file, userProfile.id, userName || undefined);

      console.log('Upload response:', response); // Debug log

      // Update local state with the new resume URL
      if (response && response.downloadUrl) {
        setLocalResumeUrl(response.downloadUrl);
      }

      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    }
  };

    const handleDownloadResume = async () => {
    if (!localResumeUrl) {
      toast.error('No resume found to download');
      return;
    }

    try {
      // Extract UUID from the full URL
      const resumeUrl = localResumeUrl;
      const uuidMatch = resumeUrl.match(/\/download\/([^\/]+)$/);
      if (!uuidMatch) {
        toast.error('Invalid resume URL format');
        return;
      }
      const resumeUuid = uuidMatch[1];

      // Create formatted filename
      const userName = `${userProfile?.firstName || ''}`.trim();

      // Determine file extension from content type or fallback to URL extraction
      let fileExtension = 'pdf'; // Default fallback

      if (userProfile?.resumeContentType) {
        switch (userProfile.resumeContentType) {
          case 'application/pdf':
            fileExtension = 'pdf';
            break;
          case 'application/msword':
            fileExtension = 'doc';
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            fileExtension = 'docx';
            break;
          case 'application/rtf':
          case 'text/rtf':
            fileExtension = 'rtf';
            break;
          default:
            // Fallback to URL extraction if content type is not recognized
            const urlMatch = resumeUrl.match(/\.([^\/\?]+)(?:\?|$)/);
            fileExtension = urlMatch ? urlMatch[1] : 'pdf';
        }
      } else {
        // Fallback to URL extraction if no content type is provided
        const urlMatch = resumeUrl.match(/\.([^\/\?]+)(?:\?|$)/);
        fileExtension = urlMatch ? urlMatch[1] : 'pdf';
      }

      const fileName = userName ? `${userName}.${fileExtension}` : undefined;

      await downloadResume(resumeUuid, fileName);
      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const handleDeleteResume = async () => {
    if (!localResumeUrl) {
      toast.error('No resume found to delete');
      return;
    }

    try {
      await deleteResume();
      // Update local state to remove the resume URL
      setLocalResumeUrl(null);
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get all form fields that have values
    const fieldsToValidate = Object.keys(formData).map(field => ({
      name: field,
      value: formData[field] || '',
      required: !['portfolioWebsite', 'linkedInProfile', 'githubProfile'].includes(field) // Only required if not these fields
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
        designationId: formData.designationId ? parseInt(formData.designationId) : undefined,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
        countryId: formData.countryId ? parseInt(formData.countryId) : undefined,
        stateId: formData.stateId ? parseInt(formData.stateId) : undefined,
        cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        monthsOfExperience: parseInt(formData.monthsOfExperience) || 0,
        skillNames: formData.skillNames ? formData.skillNames.split(',').map(skill => skill.trim()) : [],
        skillIds: formData.skillIds ? formData.skillIds.split(',').map(id => id.trim()) : [],
        company: formData.company,
        companyId: formData.companyId ? parseInt(formData.companyId) : undefined,
        currentSalaryCurrencyId: formData.currentSalaryCurrencyId ? parseInt(formData.currentSalaryCurrencyId) : undefined,
        currentSalary: formData.currentSalary ? parseFloat(formData.currentSalary) : undefined,
        portfolioWebsite: formData.portfolioWebsite,
        linkedInProfile: formData.linkedInProfile,
        githubProfile: formData.githubProfile,
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
                label="Current Company"
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
                countryLabel="Work Country"
                cityLabel="Work City"
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
                label="Professional Skills"
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
                salaryFieldName="currentSalary"
                currencyFieldName="currentSalaryCurrencyId"
                currencyLabel="Current Salary Currency"
                salaryLabel="dfdf"
              />
            </div>

            <div className="w-full">
              <PersonalWebsite
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
              />
            </div>
            <div className="w-full">
              <LinkedIn
                formData={{ ...formData, linkedin: formData.linkedInProfile }}
                errors={{ ...errors, linkedin: errors.linkedInProfile }}
                touched={{ ...touched, linkedin: touched.linkedInProfile }}
                onInputChange={e => {
                  const { value } = e.target;
                  handleInputChange({
                    ...e,
                    target: { ...e.target, name: 'linkedInProfile', value }
                  });
                }}
                onBlur={() => setTouched(prev => ({ ...prev, linkedInProfile: true }))}
              />
            </div>
            <div className="w-full">
              <GitHub
                formData={{ ...formData, github: formData.githubProfile }}
                errors={{ ...errors, github: errors.githubProfile }}
                touched={{ ...touched, github: touched.githubProfile }}
                onInputChange={e => {
                  const { value } = e.target;
                  handleInputChange({
                    ...e,
                    target: { ...e.target, name: 'githubProfile', value }
                  });
                }}
                onBlur={() => setTouched(prev => ({ ...prev, githubProfile: true }))}
              />
            </div>
            <div className="w-full">
              <Resume
                errors={errors}
                touched={touched}
                onFileUpload={handleFileUpload}
                onDownloadResume={handleDownloadResume}
                onDeleteResume={handleDeleteResume}
                currentResume={localResumeUrl}
                userName={`${userProfile?.firstName || ''}`.trim()}
                resumeContentType={userProfile?.resumeContentType || undefined}
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

export default function Profile() {
  return <ProfileContent />;
}