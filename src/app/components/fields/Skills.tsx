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
 * @property {string} [fieldName] - Field name for the ID field
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
  fieldName?: string;
}

interface SkillOption {
  id: string;
  name: string;
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
  label = "Skills",
  fieldName = "skillIds"
}) => {
  const [skills, setSkills] = useState<SkillOption[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      if (!propOptions || propOptions.length === 0) {
        try {
          const fetchedSkills = await fetchSkills('');
          // console.log(fetchedSkills);
          // Convert the fetched skills to the expected format
          const convertedSkills = fetchedSkills.map((skill: { value: string; label: string }) => ({
            id: skill.value,
            name: skill.label
          }));
          setSkills(convertedSkills);
        } catch (error) {
          console.error('Failed to fetch skills:', error);
          toast.error('Failed to load skills. Please try again.');
        }
      } else {
        // Convert prop options to the expected format
        const convertedSkills = propOptions.map((skill: { value: string; label: string }) => ({
          id: skill.value,
          name: skill.label
        }));
        setSkills(convertedSkills);
      }
    };

    loadSkills();
  }, [propOptions]);

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillNames = e.target.value.split(',').map((name: string) => name.trim()).filter((name: string) => name);

    // Update skillNames or tags based on fieldName prop
    const skillNamesEvent = {
      target: {
        name: fieldName === 'skillIds' ? 'skillNames' : fieldName,
        value: skillNames.join(', ')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(skillNamesEvent);

    // Update skillIds based on the selected names
    const selectedSkillIds = skillNames.map((name: string) => {
      const skill = skills.find((s: SkillOption) => s.name.toLowerCase() === name.toLowerCase());
      return skill ? skill.id : '';
    }).filter((id: string) => id);

    const skillIdsEvent = {
      target: {
        name: fieldName,
        value: selectedSkillIds.join(',')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(skillIdsEvent);
  };

  return (
    <div className="skills-field w-full mb-4">
      <TypeAheadField
        label={label}
        name={fieldName === 'skillIds' ? 'skillNames' : fieldName}
        value={formData[fieldName === 'skillIds' ? 'skillNames' : fieldName] || ''}
        onChange={handleSkillChange}
        onBlur={() => onBlur(fieldName === 'skillIds' ? 'skillNames' : fieldName)}
        error={touched[fieldName === 'skillIds' ? 'skillNames' : fieldName] ? errors[fieldName === 'skillIds' ? 'skillNames' : fieldName] : undefined}
        suggestions={skills.map(skill => ({
          value: skill.name,
          label: skill.name
        }))}
        required={required}
        placeholder="Type to search skills..."
        className="skills-typeahead w-full"
      />
    </div>
  );
};

export default Skills;