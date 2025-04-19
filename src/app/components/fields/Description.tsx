import React from 'react';

interface DescriptionProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
}

export default function Description({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = "Description"
}: DescriptionProps) {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description || ''}
          onChange={onInputChange}
          onBlur={() => onBlur('description')}
          className={`block w-full rounded-md sm:text-sm ${
            errors.description && touched.description
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }`}
          placeholder="Enter job description"
          required={required}
        />
      </div>
      {errors.description && touched.description && (
        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
      )}
    </div>
  );
}