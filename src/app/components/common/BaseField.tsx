import React from 'react';

export interface BaseFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export const BaseFieldWrapper: React.FC<BaseFieldProps & { children: React.ReactNode }> = ({
  id,
  label,
  required = false,
  error,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};