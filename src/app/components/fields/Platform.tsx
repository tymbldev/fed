import React from 'react';
import SelectField from '../common/SelectField';

interface PlatformProps {
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

const Platform: React.FC<PlatformProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  disabled = false,
  label = "Platform",
  fieldName = "platform"
}) => {
  const platforms = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Indeed', label: 'Indeed' },
    { value: 'Glassdoor', label: 'Glassdoor' },
    { value: 'Monster', label: 'Monster' },
    { value: 'CareerBuilder', label: 'CareerBuilder' },
    { value: 'ZipRecruiter', label: 'ZipRecruiter' },
    { value: 'Company Website', label: 'Company Website' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="w-full md:w-1/2">
      <SelectField
        label={label}
        name={fieldName}
        options={platforms}
        required={required}
        value={formData[fieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(fieldName)}
        error={touched[fieldName] && errors[fieldName] ? errors[fieldName] : undefined}
        disabled={disabled}
      />
    </div>
  );
};

export default Platform;