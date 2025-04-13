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
  options?: { value: string; label: string }[];
}

const Skills: React.FC<SkillsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
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
      name="skillIds"
      value={formData['skillIds'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('skillIds')}
      error={touched['skillIds'] ? errors['skillIds'] : undefined}
      suggestions={skills}
      required
      placeholder="Type to search skills..."
    />
  );
};

export default Skills;