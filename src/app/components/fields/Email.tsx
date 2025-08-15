import React from 'react';

interface EmailProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const Email: React.FC<EmailProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required,
  disabled
}) => {
  return (
    <div>
      <label htmlFor="email" className="label">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required={required}
        disabled={disabled}
        value={formData['email'] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('email')}
        className={`input ${touched['email'] && errors['email'] ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400' : ''}`}
        placeholder="Enter your email"
      />
      {touched['email'] && errors['email'] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['email']}</p>
      )}
    </div>
  );
};

export default Email;