import React from 'react';

interface TotalWorkExperienceProps {
  formData: {
    yearsOfExperience?: string;
    monthsOfExperience?: string;
  };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
}

const TotalWorkExperience: React.FC<TotalWorkExperienceProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}) => {
  // Generate years array from 0 to 30
  const years = Array.from({ length: 31 }, (_, i) => i.toString());

  // Generate months array from 0 to 12
  const months = Array.from({ length: 13 }, (_, i) => i.toString());

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Total Work Experience
      </label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <select
            name="yearsOfExperience"
            value={formData.yearsOfExperience || ''}
            onChange={onInputChange}
            onBlur={() => onBlur('yearsOfExperience')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              touched.yearsOfExperience && errors.yearsOfExperience
                ? 'border-red-500'
                : ''
            }`}
          >
            <option value="">Select Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year} Year{year === '1' ? '' : 's'}
              </option>
            ))}
          </select>
          {touched.yearsOfExperience && errors.yearsOfExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
          )}
        </div>
        <div>
          <select
            name="monthsOfExperience"
            value={formData.monthsOfExperience || ''}
            onChange={onInputChange}
            onBlur={() => onBlur('monthsOfExperience')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              touched.monthsOfExperience && errors.monthsOfExperience
                ? 'border-red-500'
                : ''
            }`}
          >
            <option value="">Select Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month} {month === '1' ? 'Month' : 'Months'}
              </option>
            ))}
          </select>
          {touched.monthsOfExperience && errors.monthsOfExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.monthsOfExperience}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalWorkExperience;