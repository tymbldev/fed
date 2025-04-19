import React, { useState, useEffect } from 'react';
import SingleTypeAheadField from '../common/SingleTypeAheadField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface DesignationProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
  fieldName?: string;
}

interface Option {
  id: string;
  name: string;
}

const Designation: React.FC<DesignationProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = "Designation",
  fieldName = "designation"
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data: Option[] = await fetchDropdownOptions('designations') as unknown as Option[];
        setOptions(data);
      } catch (err) {
        console.error('Failed to fetch designations:', err);
        toast.error('Failed to load designations. Please try again.');
      }
    };

    loadOptions();
  }, []);

  return (
    <SingleTypeAheadField
      label={label}
      name={fieldName}
      value={formData[fieldName] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur(fieldName)}
      error={touched[fieldName] ? errors[fieldName] : undefined}
      suggestions={options.map(opt => ({
        value: opt.name,
        label: opt.name
      }))}
      required={required}
    />
  );
};

export default Designation;