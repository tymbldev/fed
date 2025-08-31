import React from 'react';

interface UniqueUrlProps {
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

const UniqueUrl: React.FC<UniqueUrlProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  disabled = false,
  label = "Job Posting URL",
  fieldName = "uniqueUrl"
}) => {
  return (
    <div>
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldName}
        name={fieldName}
        type="url"
        required={required}
        disabled={disabled}
        value={formData[fieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(fieldName)}
        className={`block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${touched[fieldName] && errors[fieldName] ? 'border-red-500' : ''}`}
        placeholder="https://example.com/job/1"
      />
      {touched[fieldName] && errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );
};

export default UniqueUrl;