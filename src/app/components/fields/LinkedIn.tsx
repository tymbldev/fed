import React from 'react';
import Image from 'next/image';

interface LinkedInProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (field: string) => void;
}

const LinkedIn: React.FC<LinkedInProps> = ({ formData, errors, touched, onInputChange, onBlur }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor="linkedin" className="text-sm font-medium text-gray-700">LinkedIn</label>
    <div className="relative">
      <input
        type="url"
        id="linkedin"
        name="linkedin"
        placeholder="linkedin.com/in/username"
        value={formData.linkedin || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('linkedin')}
        className={`w-full pl-3 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.linkedin && touched.linkedin ? 'border-red-500' : 'border-gray-300'}`}
        autoComplete="off"
      />
      <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <Image src="/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} />
      </span>
    </div>
    {errors.linkedin && touched.linkedin && (
      <span className="text-xs text-red-500">{errors.linkedin}</span>
    )}
  </div>
);

export default LinkedIn;