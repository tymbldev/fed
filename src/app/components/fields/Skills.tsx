import React, { useState, useEffect } from 'react';
import TypeAheadField from '../common/TypeAheadField';
import { fetchSkills } from '../../services/api';
import { toast } from 'sonner';

/**
 * Props interface for the Skills component
 * @interface SkillsProps
 * @property {Object} formData - Form data object containing field values
 * @property {Object} errors - Object containing field error messages
 * @property {Object} touched - Object tracking which fields have been touched
 * @property {Function} onInputChange - Handler for input changes
 * @property {Function} onBlur - Handler for field blur events
 * @property {boolean} [required] - Whether the field is required
 * @property {Array<{value: string, label: string}>} [options] - Predefined skill options
 * @property {string} [label] - Field label text
 */
interface SkillsProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
  label?: string;
}

/**
 * Skills component that provides a type-ahead field for selecting skills
 * Supports both predefined options and dynamic fetching from API
 * @component
 */
const Skills: React.FC<SkillsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  options: propOptions,
  label = "Skills"
}) => {
  const [skills, setSkills] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      if (!propOptions || propOptions.length === 0) {
        try {
          const fetchedSkills = await fetchSkills('');
          setSkills(fetchedSkills);
        } catch (error) {
          console.error('Failed to fetch skills:', error);
          toast.error('Failed to load skills. Please try again.');
        }
      } else {
        setSkills(propOptions);
      }
    };

    loadSkills();
  }, [propOptions]);

  return (
    <div className="skills-field w-full mb-4">
      <TypeAheadField
        label={label}
        name="skillNames"
        value={formData['skillNames'] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('skillNames')}
        error={touched['skillNames'] ? errors['skillNames'] : undefined}
        suggestions={skills}
        required={required}
        placeholder="Type to search skills..."
        className="skills-typeahead w-full"
      />
    </div>
  );
};

export default Skills;