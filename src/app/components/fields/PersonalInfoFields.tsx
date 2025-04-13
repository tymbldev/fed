import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface PersonalInfoFieldsProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}) => {
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchDropdownOptions('roles');
        setRoles(data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        toast.error('Failed to load roles. Please try again.');
      }
    };

    loadRoles();
  }, []);

  return (
    <div className="space-y-6">
      <InputField
        label="First Name"
        name="firstName"
        value={formData['firstName'] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('firstName')}
        error={touched['firstName'] ? errors['firstName'] : undefined}
        required
      />
      <InputField
        label="Last Name"
        name="lastName"
        value={formData['lastName'] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('lastName')}
        error={touched['lastName'] ? errors['lastName'] : undefined}
        required
      />
      <SelectField
        label="Role"
        name="role"
        options={roles}
        value={formData['role'] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('role')}
        error={touched['role'] ? errors['role'] : undefined}
        required
      />
    </div>
  );
};

export default PersonalInfoFields;