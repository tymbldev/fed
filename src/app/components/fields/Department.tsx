import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface DepartmentOption {
  id: number;
  name: string;
}

interface DepartmentProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
}

const Department: React.FC<DepartmentProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false
}) => {
  const [options, setOptions] = useState<DepartmentOption[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchDropdownOptions('departments') as unknown as DepartmentOption[];
        console.log("departments", data);
        setOptions(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        toast.error('Failed to load departments. Please try again.');
      }
    };

    loadOptions();
  }, []);

  return (
    <SelectField
      label="Department"
      name="departmentId"
      options={options.map(opt => ({
        value: opt.id.toString(),
        label: opt.name
      }))}
      value={formData.departmentId || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('departmentId')}
      error={touched.departmentId ? errors.departmentId : undefined}
      required={required}
    />
  );
};

export default Department;