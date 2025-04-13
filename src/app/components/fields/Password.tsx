import React, { useState } from 'react';
import InputField from '../common/InputField';

interface PasswordProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
}

const Password: React.FC<PasswordProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData['password'] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('password')}
        error={touched['password'] ? errors['password'] : undefined}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default Password;