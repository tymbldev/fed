import React from 'react';
import InputField from '../common/InputField';

interface PhoneProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
}

const Phone: React.FC<PhoneProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  // Use either 'phone' or 'phoneNumber' field
  const phoneValue = formData['phone'] || formData['phoneNumber'] || '';

  return (
    <InputField
      label="Phone"
      name="phone"
      type="tel"
      value={phoneValue}
      onChange={onInputChange}
      onBlur={() => onBlur('phone')}
      error={touched['phone'] ? errors['phone'] : undefined}
      required
    />
  );
};

export default Phone;