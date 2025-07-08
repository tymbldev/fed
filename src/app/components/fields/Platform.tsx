import React from 'react';

interface PlatformProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  fieldName?: string;
}

const Platform: React.FC<PlatformProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  disabled = false,
  label = "Platform",
  fieldName = "platform"
}) => {
  const platforms = [
    { value: '', label: 'Select a platform' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Indeed', label: 'Indeed' },
    { value: 'Glassdoor', label: 'Glassdoor' },
    { value: 'Monster', label: 'Monster' },
    { value: 'CareerBuilder', label: 'CareerBuilder' },
    { value: 'ZipRecruiter', label: 'ZipRecruiter' },
    { value: 'Company Website', label: 'Company Website' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="w-full md:w-1/2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={fieldName}
        name={fieldName}
        required={required}
        disabled={disabled}
        value={formData[fieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(fieldName)}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${touched[fieldName] && errors[fieldName] ? 'border-red-500' : ''}`}
      >
        {platforms.map((platform) => (
          <option key={platform.value} value={platform.value}>
            {platform.label}
          </option>
        ))}
      </select>
      {touched[fieldName] && errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );
};

export default Platform;