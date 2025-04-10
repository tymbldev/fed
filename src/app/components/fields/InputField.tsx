import React from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  onBlur?: () => void;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  autoComplete,
  className = '',
  onBlur,
  error,
  value,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className={`mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] ${className}`}
        placeholder={placeholder}
        onBlur={onBlur}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;