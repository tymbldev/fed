import React from 'react';
import TypeAheadField from '../common/TypeAheadField';

interface SkillsProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  options: { value: string; label: string }[];
}

const Skills: React.FC<SkillsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  options
}) => {
  return (
    <TypeAheadField
      label="Skills"
      name="skills"
      value={formData['skills'] || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('skills')}
      error={touched['skills'] ? errors['skills'] : undefined}
      suggestions={options}
      required
    />
  );
};

export default Skills;