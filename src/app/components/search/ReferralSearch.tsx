'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Keywords from './fields/keywords';
import LocationTypeahead from './fields/LocationTypeahead';
import SingleExperience from './fields/SingleExperience';
import { validateField } from '../../utils/validation';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  country: string;
  city: string;
  experience: string;
}

interface ReferralSearchProps {
  onSearch: (searchData: SearchFormData) => void;
  className?: string;
  initialValues?: SearchFormData;
  isLoading?: boolean;
  autoDefaultToIndia?: boolean;
}

export default function ReferralSearch({ onSearch, className = '', initialValues, isLoading = false, autoDefaultToIndia = false }: ReferralSearchProps) {
  const [formData, setFormData] = useState<SearchFormData>(() => {
    console.log('initialValues', initialValues);
    // If initialValues are provided, use them exactly (including empty values)
    if (initialValues) {
      return {
        keyword: initialValues.keyword || '',
        country: initialValues.country || '',
        city: initialValues.city || '',
        experience: initialValues.experience || ''
      };
    }
    // If no initialValues, start with empty values - Location component will set India as default
    return {
      keyword: '',
      country: '',
      city: '',
      experience: ''
    };
  });

  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      // Use initialValues exactly as provided (preserving explicitly cleared values)
      setFormData(initialValues);
    } else {
      // Reset to empty values when no initialValues - Location component will set India as default
      setFormData({
        keyword: '',
        country: '',
        city: '',
        experience: ''
      });
    }
  }, [initialValues]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('handleInputChange', e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Only validate required fields on blur
    if (field === 'keyword') {
      // Validate keyword field (required)
      const error = validateField(field, formData[field] || '', true);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [field]: error
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
    // For non-required fields (experience), don't validate on blur
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors: { [key: string]: string } = {};
    const keywordError = validateField('keyword', formData.keyword, true);
    if (keywordError) {
      newErrors.keyword = keywordError;
    }

    // Mark all fields as touched to show errors
    const newTouched = {
      keyword: true,
      experience: true
    };

    setErrors(newErrors);
    setTouched(newTouched);

    // Only submit if there are no errors
    if (Object.keys(newErrors).length === 0) {
      onSearch(formData);
    }
  };

  const handleClear = () => {
    const clearedData = {
      keyword: '',
      country: '',
      city: '',
      experience: ''
    };
    setFormData(clearedData);
    // onSearch(clearedData);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Search Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Field - Using existing component with custom labels */}
          <div>
            <Keywords
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              required={true}
              label="Keyword"
              fieldName="keyword"
              updateFieldName="keyword"
              placeholder="Enter job title or designation..."
            />
          </div>

          {/* Location Field - single typeahead for city and country */}
          <div>
            <LocationTypeahead
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              required={false}
              autoDefaultToIndia={autoDefaultToIndia}
            />
          </div>

          {/* Experience Field - Single selection */}
          <div>
            <SingleExperience
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              required={false}
              label="Work Experience"
              fieldName="experience"
              placeholder="Select years of experience"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              isLoading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search Referrals'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


