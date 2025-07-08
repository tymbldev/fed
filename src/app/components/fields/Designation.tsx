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
  fieldName = "designationId"
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

    // Update both designation and designationId
    const designationEvent = {
      target: {
        name: 'designation',
        value: inputValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(designationEvent);

    // Clear designationId when user types
    if (inputValue === '') {
      const designationIdEvent = {
        target: {
          name: fieldName,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(designationIdEvent);
    }
  };

  const handleBlur = () => {
    const designationName = formData['designation'] || '';

    if (designationName) {
      // Check if the designation name maps to an existing designation
      const foundDesignation = options.find(opt =>
        opt.name.toLowerCase() === designationName.toLowerCase()
      );

      if (foundDesignation) {
        // Update designationId with the found designation's ID
        const designationIdEvent = {
          target: {
            name: fieldName,
            value: foundDesignation.id
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(designationIdEvent);
      } else {
        // No mapping found, set designationId to 1000
        const designationIdEvent = {
          target: {
            name: fieldName,
            value: '1000'
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(designationIdEvent);
      }
    }

    // Call the original onBlur
    onBlur('designation');
  };

  const handleSuggestionSelect = (suggestion: { value: string; label: string }) => {
    const selectedOption = options.find(opt => opt.name === suggestion.label);
    if (selectedOption) {
      // Update designationId
      const designationIdEvent = {
        target: {
          name: fieldName,
          value: selectedOption.id
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(designationIdEvent);

      // Update designation name
      const designationEvent = {
        target: {
          name: 'designation',
          value: selectedOption.name
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(designationEvent);
    } else {
      // No mapping found, set ID to 1000
      const designationIdEvent = {
        target: {
          name: fieldName,
          value: '1000'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(designationIdEvent);

      // Update designation name with the input value
      const designationEvent = {
        target: {
          name: 'designation',
          value: suggestion.label
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(designationEvent);
    }
  };

  return (
    <SingleTypeAheadField
      label={label}
      name="designation"
      value={formData['designation'] || ''}
      onChange={handleInputChange}
      onBlur={handleBlur}
      error={touched['designation'] ? errors['designation'] : undefined}
      suggestions={options.map(opt => ({
        value: opt.id,
        label: opt.name
      }))}
      required={required}
      onSuggestionSelect={handleSuggestionSelect}
    />
  );
};

export default Designation;