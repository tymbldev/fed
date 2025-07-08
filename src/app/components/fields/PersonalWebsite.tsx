import React from 'react';
import Image from 'next/image';

interface PersonalWebsiteProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (field: string) => void;
}

const PersonalWebsite: React.FC<PersonalWebsiteProps> = ({ formData, errors, touched, onInputChange, onBlur }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor="personalWebsite" className="text-sm font-medium text-gray-700">Personal Website</label>
    <div className="relative">
      <input
        type="url"
        id="personalWebsite"
        name="personalWebsite"
        placeholder="yoursite.com"
        value={formData.personalWebsite || ''}
        onChange={onInputChange}
        onBlur={() => onBlur('personalWebsite')}
        className={`w-full pl-3 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.personalWebsite && touched.personalWebsite ? 'border-red-500' : 'border-gray-300'}`}
        autoComplete="off"
      />
      <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <Image src="/icons/weblink.svg" alt="Website" width={20} height={20} />
      </span>
    </div>
    {errors.personalWebsite && touched.personalWebsite && (
      <span className="text-xs text-red-500">{errors.personalWebsite}</span>
    )}
  </div>
);

export default PersonalWebsite;