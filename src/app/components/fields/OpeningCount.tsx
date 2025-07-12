import React from 'react';

interface OpeningCountProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  fieldName?: string;
}

const OpeningCount: React.FC<OpeningCountProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  disabled = false,
  label = "Number of Openings",
  fieldName = "openingCount"
}) => {
    const currentValue = parseInt(formData[fieldName] || '1') || 1;

  const handleIncrement = () => {
    const newValue = currentValue + 1;
    const event = {
      target: {
        name: fieldName,
        value: newValue.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleDecrement = () => {
    if (currentValue > 1) {
      const newValue = currentValue - 1;
      const event = {
        target: {
          name: fieldName,
          value: newValue.toString()
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(event);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      onInputChange(e);
    }
  };

  return (
    <div className="w-full md:w-1/3">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center max-w-[120px]">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || currentValue <= 1}
          className="px-2 h-12 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          -
        </button>
        <input
          id={fieldName}
          name={fieldName}
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          required={required}
          disabled={disabled}
          value={formData[fieldName] || '1'}
          onChange={handleInputChange}
          onBlur={() => onBlur(fieldName)}
          className={`w-12 h-12 text-center border-t border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm py-2 ${touched[fieldName] && errors[fieldName] ? 'border-red-500' : ''}`}
          placeholder="1"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className="px-2 h-12 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm"
        >
          +
        </button>
      </div>
      {touched[fieldName] && errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );
};

export default OpeningCount;