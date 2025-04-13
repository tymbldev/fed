import React from 'react';
import InputField from '../common/InputField';

interface FirstNameProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
}

const FirstName: React.FC<FirstNameProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  return (
    <InputField
      label="First Name"
      name="firstName"
      value={formData['firstName'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('firstName')}
      error={touched['firstName'] ? errors['firstName'] : undefined}
      required
    />
  );
};

export default FirstName;