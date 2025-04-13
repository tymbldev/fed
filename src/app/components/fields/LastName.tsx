import React from 'react';
import InputField from '../common/InputField';

interface LastNameProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
}

const LastName: React.FC<LastNameProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  return (
    <InputField
      label="Last Name"
      name="lastName"
      value={formData['lastName'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('lastName')}
      error={touched['lastName'] ? errors['lastName'] : undefined}
      required
    />
  );
};

export default LastName;