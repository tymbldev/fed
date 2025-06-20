import React, { useState, useEffect } from 'react';
import Phone from './Phone';
import Company from './Company';
import Designation from './Designation';
import Skills from './Skills';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface ProfessionalInfoFieldsProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
}

const ProfessionalInfoFields: React.FC<ProfessionalInfoFieldsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<{
    companies: { value: string; label: string }[];
    designations: { value: string; label: string }[];
    skills: { value: string; label: string }[];
  }>({
    companies: [],
    designations: [],
    skills: []
  });

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [companies, designations, skills] = await Promise.all([
          fetchDropdownOptions('companies'),
          fetchDropdownOptions('designations'),
          fetchDropdownOptions('skills')
        ]);
        setDropdownOptions({ companies, designations, skills });
      } catch (err) {
        console.error('Failed to fetch professional data:', err);
        toast.error('Failed to load professional data. Please try again.');
      }
    };

    loadDropdownData();
  }, []);

  return (
    <div className="space-y-6">
      <Phone
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={onInputChange}
        onBlur={onBlur}
      />
      <Company
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={onInputChange}
        onBlur={onBlur}
      />
      <Designation
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={onInputChange}
        onBlur={onBlur}
      />
      <Skills
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={onInputChange}
        onBlur={onBlur}
        options={dropdownOptions.skills}
      />
    </div>
  );
};

export default ProfessionalInfoFields;