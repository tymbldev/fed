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
  salaryLabel = "Salary"
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

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectField
        label={currencyLabel}
        name="currentSalaryCurrencyId"
        options={currencies.map(opt => ({
          value: opt.id.toString(),
          label: opt.name
        }))}
        value={formData.currentSalaryCurrencyId || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('currentSalaryCurrencyId')}
        error={touched.currentSalaryCurrencyId ? errors.currentSalaryCurrencyId : undefined}
        required={required}
      />
      <InputField
        label={salaryLabel}
        name="currentSalary"
        type="number"
        value={formData.currentSalary || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('currentSalary')}
        error={touched.currentSalary ? errors.currentSalary : undefined}
        required={required}
        placeholder="Enter your salary"
        min="0"
      />
    </div>
  );
};

export default Salary;