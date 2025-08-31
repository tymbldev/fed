import React from 'react';

interface SingleExperienceProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
  fieldName?: string;
  placeholder?: string;
}

const SingleExperience: React.FC<SingleExperienceProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = "Experience",
  fieldName = "experience",
  placeholder = "Select experience"
}) => {
  // Generate experience options (1-30 years)
  const experienceOptions = Array.from({ length: 30 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? 'year' : 'years'}`
  }));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={fieldName}
        value={formData[fieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(fieldName)}
        required={required}
        className={`block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${
          touched[fieldName] && errors[fieldName]
            ? 'border-red-500'
            : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {experienceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {touched[fieldName] && errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );
};

export default SingleExperience;


