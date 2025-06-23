import React from 'react';

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
  // Get the combined phone value (either 'phone' or 'phoneNumber')
  const combinedPhoneValue = formData['phone'] || formData['phoneNumber'] || '';

  // Split the combined value into ISD and phone number
  const [isdCode, phoneNumber] = combinedPhoneValue.includes('-')
    ? combinedPhoneValue.split('-', 2)
    : ['', combinedPhoneValue];

  // Custom handler for ISD field
  const handleIsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');

    // Create a synthetic event for the combined phone field
    const syntheticEvent = {
      target: {
        name: 'phone',
        value: `${numericValue}-${phoneNumber}`
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onInputChange(syntheticEvent);
  };

  // Custom handler for phone number field
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');

    // Create a synthetic event for the combined phone field
    const syntheticEvent = {
      target: {
        name: 'phone',
        value: `${isdCode}-${numericValue}`
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onInputChange(syntheticEvent);
  };

  // Custom blur handlers
  const handleIsdBlur = () => {
    onBlur('phone');
  };

  const handlePhoneBlur = () => {
    onBlur('phone');
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2">
        <div className="w-1/3">
          <input
            type="text"
            name="isd"
            value={isdCode}
            onChange={handleIsdChange}
            onBlur={handleIsdBlur}
            placeholder="ISD Code"
            className={`block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base sm:text-sm ${touched['phone'] && errors['phone'] ? 'border-red-500' : ''}`}
            inputMode="numeric"
            pattern="[0-9]*"
            minLength={2}
            maxLength={3}
          />
        </div>
        <div className="w-2/3">
          <input
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            placeholder="Phone Number"
            className={`block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base sm:text-sm ${touched['phone'] && errors['phone'] ? 'border-red-500' : ''}`}
            inputMode="numeric"
            pattern="[0-9]*"
            minLength={7}
            maxLength={10}
          />
        </div>
      </div>
      {touched['phone'] && errors['phone'] && (
        <p className="mt-2 text-sm text-red-600">{errors['phone']}</p>
      )}
    </div>
  );
};

export default Phone;