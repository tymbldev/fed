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
  placeholder?: string;
  updateFieldName?: string;
}

interface Option {
  id: string;
  name: string;
  type: 'skill' | 'designation' | 'company';
}

const Keywords: React.FC<KeywordsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  // onBlur,
  required = false,
  label = "Enter Skills, Designations or Company Names",
  placeholder = "Search for skills, designations, or companies...",
  updateFieldName = "keywords"
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadAllOptions = async () => {
      try {
        // Fetch all three types of data in parallel
        const [designationsData, companiesData, skillsData] = await Promise.all([
          fetchDropdownOptions('designations'),
          fetchDropdownOptions('companies'),
          fetchDropdownOptions('skills')
        ]);

        // Combine all options with type indicators
        const allOptions: Option[] = [
          // Add designations
          ...(designationsData).map((item) => ({
            id: item.id,
            name: item.name,
            type: 'designation' as const
          })),
          // Add companies
          ...(companiesData).map((item) => ({
            id: item.id,
            name: item.name,
            type: 'company' as const
          })),
          // Add skills
          ...(skillsData).map((item) => ({
            id: item.id,
            name: item.name,
            type: 'skill' as const
          }))
        ];
        setOptions(allOptions);
      } catch (err) {
        console.error('Failed to fetch keywords data:', err);
        toast.error('Failed to load keywords data. Please try again.');
      }
    };

    loadAllOptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Update the keywords field
    const updateEvent = {
      target: {
        name: updateFieldName,
        value: inputValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(updateEvent);

    // Clear related fields when user types
    if (inputValue === '') {
      const clearFields = ['skillIds', 'designationId', 'companyId'];
      clearFields.forEach(field => {
        const clearEvent = {
          target: {
            name: field,
            value: ''
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(clearEvent);
      });
    }
  };

  const handleSuggestionSelect = (suggestion: { value: string; label: string }) => {
    // Find the selected option by ID
    const selectedOption = options.find(opt => opt.id === suggestion.value);

    if (selectedOption) {
      // Update the keywords field
      const keywordsEvent = {
        target: {
          name: updateFieldName,
          value: selectedOption.name
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(keywordsEvent);

      // Update the appropriate field based on type
      switch (selectedOption.type) {
        case 'skill':
          const skillEvent = {
            target: {
              name: 'skillIds',
              value: selectedOption.id
            }
          } as React.ChangeEvent<HTMLInputElement>;
          onInputChange(skillEvent);
          break;
        case 'designation':
          const designationEvent = {
            target: {
              name: 'designationId',
              value: selectedOption.id
            }
          } as React.ChangeEvent<HTMLInputElement>;
          onInputChange(designationEvent);
          break;
        case 'company':
          const companyEvent = {
            target: {
              name: 'companyId',
              value: selectedOption.id
            }
          } as React.ChangeEvent<HTMLInputElement>;
          onInputChange(companyEvent);
          break;
      }
    } else {
      // No mapping found, update keywords field with the input value
      const keywordsEvent = {
        target: {
          name: updateFieldName,
          value: suggestion.label
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(keywordsEvent);
    }
  };

  // Filter and format suggestions without type indicators
  const getSuggestions = () => {
    return options.map(opt => ({
      value: opt.id,
      label: opt.name
    }));
  };

  return (
    <SingleTypeAheadField
      label={label}
      name={updateFieldName}
      placeholder={placeholder}
      value={formData[updateFieldName] || ''}
      onChange={handleInputChange}
      error={touched[updateFieldName] ? errors[updateFieldName] : undefined}
      suggestions={getSuggestions()}
      required={required}
      onSuggestionSelect={handleSuggestionSelect}
      maxResults={100}
      debounceMs={200}
      idRequired={false}
    />
  );
};

export default Keywords;




