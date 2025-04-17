import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  required,
  value,
  onChange,
  onBlur,
  error,
  className = '',
  disabled = false
}) => {

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={`block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base sm:text-sm ${error ? 'border-red-500' : ''} ${className} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;