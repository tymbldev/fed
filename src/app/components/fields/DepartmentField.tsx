import React from 'react';
import SelectField from '../common/SelectField';

interface DepartmentProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  options: { value: string; label: string }[];
}

const Department: React.FC<DepartmentProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  options
}) => {
  return (
    <SelectField
      label="Department"
      name="department"
      value={formData['department'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('department')}
      error={touched['department'] ? errors['department'] : undefined}
      options={options}
      required
    />
  );
};

export default Department;