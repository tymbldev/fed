import React from 'react';

interface MinMaxExperienceProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  minExperienceFieldName: string;
  maxExperienceFieldName: string;
}

const MinMaxExperience: React.FC<MinMaxExperienceProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  minExperienceFieldName,
  maxExperienceFieldName,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Past work experience{required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        max={50}
        name={minExperienceFieldName}
        value={formData[minExperienceFieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(minExperienceFieldName)}
        placeholder="Min"
        className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        required={required}
      />
      <span>to</span>
      <input
        type="number"
        min={0}
        max={50}
        name={maxExperienceFieldName}
        value={formData[maxExperienceFieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(maxExperienceFieldName)}
        placeholder="Max"
        className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        required={required}
      />
    </div>
    {(touched[minExperienceFieldName] && errors[minExperienceFieldName]) && (
      <p className="mt-1 text-sm text-red-600">{errors[minExperienceFieldName]}</p>
    )}
    {(touched[maxExperienceFieldName] && errors[maxExperienceFieldName]) && (
      <p className="mt-1 text-sm text-red-600">{errors[maxExperienceFieldName]}</p>
    )}
  </div>
);

export default MinMaxExperience;