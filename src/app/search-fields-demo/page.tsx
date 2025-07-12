'use client';

import React from 'react';
import SearchFieldsExample from '../components/SearchFieldsExample';

export default function SearchFieldsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Fields Demo</h1>
          <p className="text-lg text-gray-600">
            Demonstrating how to use existing field components with custom labels and placeholders.
          </p>
        </div>

        {/* Search Fields Example */}
        <SearchFieldsExample />

        {/* Documentation */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use These Fields</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">1. Designation Field</h3>
              <p className="text-gray-600 text-sm mb-3">
                Uses the existing <code className="bg-gray-100 px-1 rounded">Designation</code> component with:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom label: &quot;Job Title&quot;</li>
                <li>• Custom placeholder: &quot;Enter job title or designation...&quot;</li>
                <li>• Type-ahead functionality</li>
                <li>• API integration for suggestions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">2. Location Field</h3>
              <p className="text-gray-600 text-sm mb-3">
                Uses the existing <code className="bg-gray-100 px-1 rounded">Location</code> component with:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom labels: &quot;Country&quot; and &quot;City&quot;</li>
                <li>• Dependent dropdowns</li>
                <li>• Horizontal layout</li>
                <li>• API integration for locations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">3. Experience Field</h3>
              <p className="text-gray-600 text-sm mb-3">
                New <code className="bg-gray-100 px-1 rounded">Experience</code> component with:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom label: &quot;Work Experience&quot;</li>
                <li>• Range-based selection (Min/Max)</li>
                <li>• Custom placeholders</li>
                <li>• 0-30 years with &quot;Fresher&quot; option</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Key Benefits</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>Reuse existing logic:</strong> No need to rewrite API calls, validation, or UI patterns</li>
              <li>• <strong>Customizable:</strong> All labels, placeholders, and field names can be customized</li>
              <li>• <strong>Consistent:</strong> Maintains the same look and feel across the application</li>
              <li>• <strong>Maintainable:</strong> Changes to core functionality automatically apply everywhere</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}