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
  label?: string;
  fieldName?: string;
}

interface Option {
  id: string;
  name: string;
}

const Company: React.FC<CompanyProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = "Company",
  fieldName = "companyId"
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data: Option[] = await fetchDropdownOptions('companies') as unknown as Option[];
        setOptions(data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        toast.error('Failed to load companies. Please try again.');
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Update both company and companyId
    const companyEvent = {
      target: {
        name: 'company',
        value: inputValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(companyEvent);

    // Clear companyId when user types
    if (inputValue === '') {
      const companyIdEvent = {
        target: {
          name: fieldName,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(companyIdEvent);
    }
  };

  const handleBlur = () => {
    const companyName = formData['company'] || '';

    if (companyName) {
      // Check if the company name maps to an existing company
      const foundCompany = options.find(opt =>
        opt.name.toLowerCase() === companyName.toLowerCase()
      );

      if (foundCompany) {
        // Update companyId with the found company's ID
        const companyIdEvent = {
          target: {
            name: fieldName,
            value: foundCompany.id
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(companyIdEvent);
      } else {
        // No mapping found, set companyId to 1000
        const companyIdEvent = {
          target: {
            name: fieldName,
            value: '1000'
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(companyIdEvent);
      }
    }

    // Call the original onBlur
    onBlur('company');
  };

  const handleSuggestionSelect = (suggestion: { value: string; label: string }) => {
    const selectedOption = options.find(opt => opt.name === suggestion.label);
    if (selectedOption) {
      // Update companyId
      const companyIdEvent = {
        target: {
          name: fieldName,
          value: selectedOption.id
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(companyIdEvent);

      // Update company name
      const companyEvent = {
        target: {
          name: 'company',
          value: selectedOption.name
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(companyEvent);
    } else {
      // No mapping found, set ID to 1000
      const companyIdEvent = {
        target: {
          name: fieldName,
          value: '1000'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(companyIdEvent);

      // Update company name with the input value
      const companyEvent = {
        target: {
          name: 'company',
          value: suggestion.label
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(companyEvent);
    }
  };

  return (
    <SingleTypeAheadField
      label={label}
      name="company"
      value={formData['company'] || ''}
      onChange={handleInputChange}
      onBlur={handleBlur}
      error={touched['company'] ? errors['company'] : undefined}
      suggestions={options.map(opt => ({
        value: opt.id,
        label: opt.name
      }))}
      required={required}
      onSuggestionSelect={handleSuggestionSelect}
    />
  );
};

export default Company;