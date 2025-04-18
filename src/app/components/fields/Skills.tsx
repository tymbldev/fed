import React, { useState, useEffect } from 'react';
import TypeAheadField from '../common/TypeAheadField';
import { fetchSkills } from '../../services/api';
import { toast } from 'sonner';

interface SkillsProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
}

const Skills: React.FC<SkillsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required,
  options: propOptions
}) => {
  const [skills, setSkills] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        // Fetch all skills with an empty query to get all skills
        const fetchedSkills = await fetchSkills('');
        setSkills(fetchedSkills);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        toast.error('Failed to load skills. Please try again.');
      }
    };

    // Only fetch skills if no options were provided
    if (!propOptions || propOptions.length === 0) {
      loadSkills();
    } else {
      setSkills(propOptions);
    }
  }, [propOptions]);

  return (
    <TypeAheadField
      label="Skills"
      name="skillNames"
      value={formData['skillNames'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('skillNames')}
      error={touched['skillNames'] ? errors['skillNames'] : undefined}
      suggestions={skills}
      required={required}
      placeholder="Type to search skills..."
    />
  );
};

export default Skills;