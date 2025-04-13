import React, { useState, useEffect, ChangeEvent } from 'react';
import SingleTypeAheadField from '../fields/SingleTypeAheadField';
import { fetchDropdownOptions } from '../../services/api';

interface FormData {
  company: string;
  jobTitle: string;
  // Add other form fields as needed
}

interface FormErrors {
  company?: string;
  jobTitle?: string;
  // Add other error fields as needed
}

interface JobTitle {
  value: string;
  label: string;
}

export const JobForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    jobTitle: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [companyOptions, setCompanyOptions] = useState<{ value: string; label: string }[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const options = await fetchDropdownOptions('companies');
        setCompanyOptions(options);
      } catch (error) {
        console.error('Error loading companies:', error);
      }
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    const loadJobTitles = async () => {
      try {
        const titles = await fetchDropdownOptions('jobTitles');
        setJobTitles(titles.map(title => ({
          value: title,
          label: title
        })));
      } catch (error) {
        console.error('Error loading job titles:', error);
      }
    };
    loadJobTitles();
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTypeAheadChange = (value: string, fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Form submitted:', formData);
  };

  const validateField = (field: keyof FormData) => {
    const value = formData[field];
    if (!value) {
      setErrors(prev => ({
        ...prev,
        [field]: `${field} is required`
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SingleTypeAheadField
        label="Company"
        name="company"
        value={formData.company}
        options={companyOptions}
        onChange={(value: string) => handleChange('company', value)}
        error={errors.company}
        required
      />
      <SingleTypeAheadField
        id="jobTitle"
        label="Job Title"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={(value) => handleTypeAheadChange(value, 'jobTitle')}
        onBlur={() => validateField('jobTitle')}
        error={errors.jobTitle}
        required
        suggestions={jobTitles}
      />
      <button type="submit">Submit</button>
    </form>
  );
};