import React, { useState, useEffect } from 'react';
import SingleTypeAheadField from '../common/SingleTypeAheadField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface CompanyProps {
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

const Company: React.FC<CompanyProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data: Option[] = await fetchDropdownOptions('companies');
        setOptions(data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        toast.error('Failed to load companies. Please try again.');
      }
    };

    loadOptions();
  }, []);

  return (
    <SingleTypeAheadField
      label="Company"
      name="company"
      value={formData['company'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('company')}
      error={touched['company'] ? errors['company'] : undefined}
      suggestions={options.map(opt => ({
        value: opt.name,
        label: opt.name
      }))}
      required={required}
    />
  );
};

export default Company;