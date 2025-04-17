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
}

interface Option {
  id: number;
  name: string;
}

const Designation: React.FC<DesignationProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data: Option[] = await fetchDropdownOptions('designations');
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
      label="Designation"
      name="designation"
      value={formData['designation'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('designation')}
      error={touched['designation'] ? errors['designation'] : undefined}
      suggestions={options.map(opt => ({
        value: opt.name,
        label: opt.name
      }))}
      required
    />
  );
};

export default Designation;