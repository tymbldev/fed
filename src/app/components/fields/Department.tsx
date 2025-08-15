import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface DepartmentProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
}

interface DepartmentOption {
  id: string;
  name: string;
}

const Department: React.FC<DepartmentProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoading(true);
        const data: DepartmentOption[] = await fetchDropdownOptions('departments') as unknown as DepartmentOption[];

        // Transform the data to have value and label properties
        const transformedOptions = data.map(dept => ({
          value: dept.id,
          label: dept.name
        }));

        setOptions(transformedOptions);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        toast.error('Failed to load departments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Show loading state if data is still loading
  if (isLoading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department {required && <span className="text-red-500">*</span>}
        </label>
        <div className="block w-full h-12 rounded-md border-gray-300 shadow-sm bg-gray-100 animate-pulse">
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading departments...
          </div>
        </div>
      </div>
    );
  }

  return (
    <SelectField
      label="Department"
      name="departmentId"
      options={options}
      value={formData.departmentId || ''}
      onChange={onInputChange}
      onBlur={() => onBlur('departmentId')}
      error={touched.departmentId ? errors.departmentId : undefined}
      required={required}
    />
  );
};

export default Department;