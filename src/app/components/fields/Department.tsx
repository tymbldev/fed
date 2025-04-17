import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';
import { Option } from '../../types/common';

interface DepartmentProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  name?: string;
  label?: string;
  endpoint?: string;
}

const Department: React.FC<DepartmentProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  name = 'department',
  label = 'Department',
  endpoint = 'departments'
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchDropdownOptions(endpoint);
        setOptions(data);
      } catch (err) {
        console.error(`Failed to fetch ${endpoint}:`, err);
        toast.error(`Failed to load ${label.toLowerCase()}s. Please try again.`);
      }
    };

    loadOptions();
  }, [endpoint, label]);

  return (
    <SelectField
      label={label}
      name={name}
      options={options.map(opt => ({
        value: opt.id.toString(),
        label: opt.name
      }))}
      value={options.find(opt => opt.id === parseInt(formData.departmentId))?.id.toString() || ''}
      onChange={onInputChange}
      onBlur={() => onBlur(name)}
      error={touched[name] ? errors[name] : undefined}
      required
    />
  );
};

export default Department;