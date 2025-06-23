import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import InputField from '../common/InputField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface SalaryProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  currencyLabel?: string;
  salaryLabel?: string;
  salaryFieldName: string;
  currencyFieldName: string;
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
  required = false,
  currencyLabel = "Currency",
  salaryLabel = "Salary",
  salaryFieldName,
  currencyFieldName
}) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const data = await fetchDropdownOptions('currencies') as unknown as CurrencyOption[];
        // console.log("currencies", data);
        setCurrencies(data);
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
        toast.error('Failed to load currencies. Please try again.');
      }
    };

    loadCurrencies();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only numeric keys, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumeric = /[0-9]/.test(e.key);
    const isAllowedKey = allowedKeys.includes(e.key);

    if (!isNumeric && !isAllowedKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectField
        label={currencyLabel}
        name={currencyFieldName}
        options={currencies.map(opt => ({
          value: opt.id.toString(),
          label: opt.name
        }))}
        value={formData[currencyFieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(currencyFieldName)}
        error={touched[currencyFieldName] ? errors[currencyFieldName] : undefined}
        required={required}
      />
      <InputField
        label={salaryLabel}
        name={salaryFieldName}
        type="text"
        value={formData[salaryFieldName] || ''}
        onChange={onInputChange}
        onBlur={() => onBlur(salaryFieldName)}
        error={touched[salaryFieldName] ? errors[salaryFieldName] : undefined}
        required={required}
        placeholder="Enter your salary"
        maxLength={9}
        pattern="[0-9]*"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Salary;