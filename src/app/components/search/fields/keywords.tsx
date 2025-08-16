import React, { useState, useEffect } from 'react';
import SingleTypeAheadField from '../../common/SingleTypeAheadField';
import { fetchDropdownOptions } from '../../../services/api';
import { toast } from 'sonner';

interface KeywordsProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
  fieldName?: string;
  placeholder?: string;
  updateFieldName?: string;
}

interface Option {
  id: string;
  name: string;
}

const Keywords: React.FC<KeywordsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  // onBlur,
  required = false,
  label = "Designation",
  fieldName = "designationId",
  placeholder,
  updateFieldName = "designation"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Update both the specified field and fieldName
    const updateEvent = {
      target: {
        name: updateFieldName,
        value: inputValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(updateEvent);

    // Clear fieldName when user types
    if (inputValue === '') {
      const fieldNameEvent = {
        target: {
          name: fieldName,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(fieldNameEvent);
    }
  };

  // const handleBlur = () => {
  //   // Call the original onBlur
  //   onBlur(updateFieldName);
  // };

  const handleSuggestionSelect = (suggestion: { value: string; label: string }) => {
    const selectedOption = options.find(opt => opt.name === suggestion.label);
    if (selectedOption) {
      // Update fieldName
      const fieldNameEvent = {
        target: {
          name: fieldName,
          value: selectedOption.id
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(fieldNameEvent);

      // Update the specified field name
      const updateEvent = {
        target: {
          name: updateFieldName,
          value: selectedOption.name
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(updateEvent);
    } else {
      // No mapping found, set ID to 1000
      const fieldNameEvent = {
        target: {
          name: fieldName,
          value: '1000'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(fieldNameEvent);

      // Update the specified field name with the input value
      const updateEvent = {
        target: {
          name: updateFieldName,
          value: suggestion.label
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(updateEvent);
    }
  };

  return (
    <SingleTypeAheadField
      label={label}
      name={updateFieldName}
      placeholder={placeholder}
      value={formData[updateFieldName] || ''}
      onChange={handleInputChange}
      // onBlur={handleBlur}
      error={touched[updateFieldName] ? errors[updateFieldName] : undefined}
      suggestions={options.map(opt => ({
        value: opt.id,
        label: opt.name
      }))}
      required={required}
      onSuggestionSelect={handleSuggestionSelect}
      maxResults={100}
      debounceMs={200}
    />
  );
};

export default Keywords;




