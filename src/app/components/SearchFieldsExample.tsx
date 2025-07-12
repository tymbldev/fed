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

export default function SearchFieldsExample() {
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
    console.log('Search form data:', formData);
    // Handle search logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Fields Example</h2>
        <p className="text-gray-600 mb-6">
          This example shows how to use existing field components with custom labels and placeholders.
        </p>

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
                label="Keywords"
                fieldName="keywordId"
                updateFieldName="keyword"
                placeholder="Job title, skills, company name..."
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
                label="Experience"
                fieldName="experience"
                placeholder="Select years of experience"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Search Jobs
            </button>
          </div>
        </form>

        {/* Display current form data */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Current Form Data:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}