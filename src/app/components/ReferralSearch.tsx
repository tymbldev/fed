'use client';

import React, { useState } from 'react';
import Designation from './fields/Designation';
import Location from './fields/Location';
import SingleExperience from './fields/SingleExperience';

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
}

export default function ReferralSearch({ onSearch, className = '' }: ReferralSearchProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    keyword: '',
    keywordId: '',
    countryId: '',
    cityId: '',
    experience: ''
  });

  const [errors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleClear = () => {
    const clearedData = {
      keyword: '',
      keywordId: '',
      countryId: '',
      cityId: '',
      experience: ''
    };
    setFormData(clearedData);
    onSearch(clearedData);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              required={false}
              label="Job Title"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Search Referrals
          </button>
        </div>
      </form>
    </div>
  );
}