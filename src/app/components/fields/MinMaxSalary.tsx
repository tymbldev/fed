import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import InputField from '../common/InputField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface MinMaxSalaryProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  currencyLabel?: string;
  minSalaryLabel?: string;
  maxSalaryLabel?: string;
  minSalaryFieldName: string;
  maxSalaryFieldName: string;
  currencyFieldName: string;
}

interface CurrencyOption {
  id: number;
  name: string;
}

const MinMaxSalary: React.FC<MinMaxSalaryProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  currencyLabel = "Currency",
  minSalaryLabel,
  maxSalaryLabel,
  minSalaryFieldName,
  maxSalaryFieldName,
  currencyFieldName
}) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  // console.log(minSalaryLabel, maxSalaryLabel);
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const data = await fetchDropdownOptions('currencies') as unknown as CurrencyOption[];
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

    const validateMinMaxSalary = () => {
    const minSalary = formData[minSalaryFieldName];
    const maxSalary = formData[maxSalaryFieldName];

    if (minSalary && maxSalary) {
      const min = parseFloat(minSalary);
      const max = parseFloat(maxSalary);

      if (isNaN(min) || isNaN(max)) {
        return 'Please enter valid numbers';
      }

      if (min > max) {
        return 'Minimum salary cannot be greater than maximum salary';
      }
    }
    return undefined;
  };

  // Get validation error for min/max salary comparison
  const minMaxError = validateMinMaxSalary();

    return (
    <div className="space-y-4">
      {/* Mobile layout: Currency full width, Min/Max in separate row */}
      <div className="block md:hidden">
        <div className="w-full mb-4">
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
            placeholder='Select Currency'
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label={minSalaryLabel || 'Minwww'}
            name={minSalaryFieldName}
            type="text"
            value={formData[minSalaryFieldName] || ''}
            onChange={onInputChange}
            onBlur={() => onBlur(minSalaryFieldName)}
            error={touched[minSalaryFieldName] ? errors[minSalaryFieldName] : undefined}
            required={false}
            placeholder="Min placeholder"
            maxLength={9}
            pattern="[0-9]*"
            onKeyDown={handleKeyPress}
            className="h-12 w-full"
          />

          <InputField
            label={maxSalaryLabel || 'Max'}
            name={maxSalaryFieldName}
            type="text"
            value={formData[maxSalaryFieldName] || ''}
            onChange={onInputChange}
            onBlur={() => onBlur(maxSalaryFieldName)}
            error={touched[maxSalaryFieldName] ? errors[maxSalaryFieldName] : undefined}
            required={false}
            placeholder="Max"
            maxLength={9}
            pattern="[0-9]*"
            onKeyDown={handleKeyPress}
            className="h-12 w-full"
          />
        </div>
      </div>

      {/* Desktop layout: All three fields in single line */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-4">
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
            placeholder='Select Currency'
          />

          <InputField
            label="Min"
            name={minSalaryFieldName}
            type="text"
            value={formData[minSalaryFieldName] || ''}
            onChange={onInputChange}
            onBlur={() => onBlur(minSalaryFieldName)}
            error={touched[minSalaryFieldName] ? errors[minSalaryFieldName] : undefined}
            required={false}
            placeholder="Min"
            maxLength={9}
            pattern="[0-9]*"
            onKeyDown={handleKeyPress}
            className="h-12 w-full"
          />

          <InputField
            label="Max"
            name={maxSalaryFieldName}
            type="text"
            value={formData[maxSalaryFieldName] || ''}
            onChange={onInputChange}
            onBlur={() => onBlur(maxSalaryFieldName)}
            error={touched[maxSalaryFieldName] ? errors[maxSalaryFieldName] : undefined}
            required={false}
            placeholder="Max"
            maxLength={9}
            pattern="[0-9]*"
            onKeyDown={handleKeyPress}
            className="h-12 w-full"
          />
        </div>
      </div>

      {/* Show min/max error */}
      {minMaxError && (
        <div>
          <p className="text-sm text-red-600">{minMaxError}</p>
        </div>
      )}
    </div>
  );
};

export default MinMaxSalary;