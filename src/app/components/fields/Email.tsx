import React from 'react';
import InputField from '../common/InputField';

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
    <InputField
      label="Email"
      name="email"
      type="email"
      value={formData['email'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('email')}
      error={touched['email'] ? errors['email'] : undefined}
      required={required}
      disabled={disabled}
    />
  );
};

export default Email;