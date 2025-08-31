import React, { useState, useEffect } from 'react';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface SalaryProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
  currencyPlaceholder?: string;
  salaryPlaceholder?: string;
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
  label = "Salary",
  currencyPlaceholder = "Currency",
  salaryPlaceholder = "Enter Salary",
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
    <div className="w-full">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <select
            name={currencyFieldName}
            value={formData[currencyFieldName] || ''}
            onChange={onInputChange}
            onBlur={() => onBlur(currencyFieldName)}
            className={`block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${touched[currencyFieldName] && errors[currencyFieldName] ? 'border-red-500' : ''}`}
            required={required}
          >
            <option value="">{currencyPlaceholder}</option>
            {currencies.map((option) => (
              <option key={option.id} value={option.id.toString()}>
                {option.name}
              </option>
            ))}
          </select>
          {touched[currencyFieldName] && errors[currencyFieldName] && (
            <p className="mt-1 text-sm text-red-600">{errors[currencyFieldName]}</p>
          )}
        </div>
        <div className="w-full">
          <input
            type="text"
            name={salaryFieldName}
            value={formData[salaryFieldName] || ''}
            onChange={onInputChange}
            onBlur={() => onBlur(salaryFieldName)}
            placeholder={salaryPlaceholder}
            required={required}
            maxLength={9}
            pattern="[0-9]*"
            onKeyDown={handleKeyPress}
            className={`block w-full h-12 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${touched[salaryFieldName] && errors[salaryFieldName] ? 'border-red-500' : ''}`}
          />
          {touched[salaryFieldName] && errors[salaryFieldName] && (
            <p className="mt-1 text-sm text-red-600">{errors[salaryFieldName]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Salary;