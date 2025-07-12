import React from 'react';
import SelectField from '../common/SelectField';

interface JobTypeProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
  fieldName: string;
}

const JobType: React.FC<JobTypeProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = "Job Type",
  fieldName
}) => {
  const jobTypeOptions = [
    { value: 'REMOTE', label: 'Remote' },
    { value: 'HYBRID', label: 'Hybrid' },
    { value: 'ONSITE', label: 'On-site' }
  ];

  return (
    <SelectField
      label={label}
      name={fieldName}
      options={jobTypeOptions}
      value={formData[fieldName] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur(fieldName)}
      error={touched[fieldName] ? errors[fieldName] : undefined}
      required={required}
    />
  );
};

export default JobType;