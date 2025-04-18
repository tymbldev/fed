import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import { InputField } from '../form/InputField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface SalaryProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
}

interface CurrencyOption {
  id: number;
  name: string;
}

const Salary: React.FC<SalaryProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false
}) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const data = await fetchDropdownOptions('currencies') as unknown as CurrencyOption[];
        console.log("currencies", data);
        setCurrencies(data);
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
        toast.error('Failed to load currencies. Please try again.');
      }
    };

    loadCurrencies();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectField
        label="Currency"
        name="currency"
        options={currencies.map(opt => ({
          value: opt.id.toString(),
          label: opt.name
        }))}
        value={formData.currency || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('currency')}
        error={touched.currency ? errors.currency : undefined}
        required={required}
      />
      <InputField
        label="Salary"
        name="salary"
        type="number"
        value={formData.salary || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('salary')}
        error={touched.salary ? errors.salary : undefined}
        required={required}
        placeholder="Enter your salary"
        min="0"
      />
    </div>
  );
};

export default Salary;