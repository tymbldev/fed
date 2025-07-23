'use client';

import React, { useState, useEffect } from 'react';
import Designation from './fields/Designation';
import Location from './fields/Location';
import SingleExperience from './fields/SingleExperience';
import { validateField } from '../utils/validation';

interface SearchFormData {
  [key: string]: string;
  keyword: string;
  keywordId: string;
  countryId: string;
  cityId: string;
  experience: string;
}

interface ReferralSearchProps {
  onSearch: (searchData: SearchFormData) => void;
  className?: string;
  initialValues?: SearchFormData;
  isLoading?: boolean;
}

export default function ReferralSearch({ onSearch, className = '', initialValues, isLoading = false }: ReferralSearchProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    keyword: initialValues?.keyword || '',
    keywordId: initialValues?.keywordId || '',
    countryId: initialValues?.countryId || '31', // Default to India (assuming countryId 1 is India)
    cityId: initialValues?.cityId || '',
    experience: initialValues?.experience || ''
  });

  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      // Reset to empty values except country (keep India as default) when initialValues is undefined/null
      setFormData({
        keyword: '',
        keywordId: '',
        countryId: '31', // Keep India as default
        cityId: '',
        experience: ''
      });
    }
  }, [initialValues]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Only validate required fields on blur
    if (field === 'keywordId' || field === 'keyword') {
      // Validate keyword field (required)
      const fieldToValidate = field === 'keywordId' ? 'keyword' : field;
      const error = validateField(fieldToValidate, formData[fieldToValidate] || '', true);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [fieldToValidate]: error
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldToValidate];
          return newErrors;
        });
      }
    }
    // For non-required fields (countryId, cityId, experience), don't validate on blur
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
      countryId: true,
      cityId: true,
      experience: true
    };

    setErrors(newErrors);
    setTouched(newTouched);

    // Only submit if there are no errors
    if (Object.keys(newErrors).length === 0) {
      // Filter out keywordId if its value is "1000" (default/placeholder value)
      const searchData = { ...formData };
      if (searchData.keywordId === '1000') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { keywordId, ...filteredData } = searchData;
        onSearch(filteredData as SearchFormData);
      } else {
        onSearch(searchData);
      }
    }
  };

  const handleClear = () => {
    const clearedData = {
      keyword: '',
      keywordId: '',
      countryId: '31', // Keep India as default when clearing
      cityId: '',
      experience: ''
    };
    setFormData(clearedData);
    onSearch(clearedData);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Search Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Field - Using existing component with custom labels */}
          <div className="md:col-span-1">
            <Designation
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              required={true}
              label="Keyword"
              fieldName="keywordId"
              updateFieldName="keyword"
              placeholder="Enter job title or designation..."
            />
          </div>

          {/* Location Field - Using existing component with custom labels */}
          <div className="md:col-span-2">
            <Location
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              required={false}
              layout="horizontal"
              countryLabel="Country"
              cityLabel="City"
            />
          </div>

          {/* Experience Field - Single selection */}
          <div className="md:col-span-1">
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