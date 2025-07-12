# Search Fields Usage Guide

This guide shows how to use existing field components with custom labels and placeholders instead of writing new logic.

## 1. Designation Field (Job Title/Keywords)

**Existing Component:** `src/app/components/fields/Designation.tsx`

**Usage with Custom Labels:**
```tsx
import Designation from '../components/fields/Designation';

<Designation
  formData={formData}
  errors={errors}
  touched={touched}
  onInputChange={handleInputChange}
  onBlur={handleBlur}
  required={false}
  label="Job Title"                    // Custom label
  fieldName="designationId"            // Custom field name
  placeholder="Enter job title..."     // Custom placeholder
/>
```

**Features:**
- Type-ahead functionality
- API integration for suggestions
- Handles both designation name and ID
- Customizable labels and placeholders

## 2. Location Field (Country/City)

**Existing Component:** `src/app/components/fields/Location.tsx`

**Usage with Custom Labels:**
```tsx
import Location from '../components/fields/Location';

<Location
  formData={formData}
  errors={errors}
  touched={touched}
  onInputChange={handleInputChange}
  onBlur={handleBlur}
  required={false}
  layout="horizontal"                  // or "vertical"
  countryLabel="Country"               // Custom country label
  cityLabel="City"                     // Custom city label
/>
```

**Features:**
- Dependent dropdowns (city depends on country)
- API integration for locations
- Horizontal or vertical layout
- Customizable labels

## 3. Experience Field (New Component)

**Component:** `src/app/components/fields/SingleExperience.tsx`

**Usage:**
```tsx
import SingleExperience from '../components/fields/SingleExperience';

<SingleExperience
  formData={formData}
  errors={errors}
  touched={touched}
  onInputChange={handleInputChange}
  onBlur={handleBlur}
  required={false}
  label="Experience"                   // Custom label
  fieldName="experience"               // Custom field name
  placeholder="Select experience"      // Custom placeholder
/>
```

**Features:**
- Single experience selection
- 1-30 years of experience
- Simple dropdown interface
- Fully customizable labels and placeholders

## Complete Example

```tsx
'use client';

import React, { useState } from 'react';
import Designation from './fields/Designation';
import Location from './fields/Location';
import SingleExperience from './fields/SingleExperience';

export default function SearchForm() {
  const [formData, setFormData] = useState({
    keywords: '',
    designation: '',
    designationId: '',
    countryId: '',
    cityId: '',
    experience: ''
  });

  const [errors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <form className="space-y-6">
      {/* Keywords */}
      <div>
        <label>Keywords</label>
        <input
          name="keywords"
          value={formData.keywords}
          onChange={handleInputChange}
          placeholder="Job title, skills, company..."
        />
      </div>

      {/* Designation with custom labels */}
      <Designation
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        label="Job Title"
        placeholder="Enter job title or designation..."
      />

      {/* Location with custom labels */}
      <Location
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        layout="horizontal"
        countryLabel="Country"
        cityLabel="City"
      />

      {/* Experience with custom labels */}
      <SingleExperience
        formData={formData}
        errors={errors}
        touched={touched}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        label="Experience"
        fieldName="experience"
        placeholder="Select years of experience"
      />
    </form>
  );
}
```

## Benefits of This Approach

1. **Reuse Existing Logic**: No need to rewrite API calls, validation, or UI patterns
2. **Customizable**: All labels, placeholders, and field names can be customized
3. **Consistent**: Maintains the same look and feel across the application
4. **Maintainable**: Changes to core functionality automatically apply everywhere
5. **Type-Safe**: Full TypeScript support with proper interfaces

## Demo

Visit `/search-fields-demo` to see these fields in action with custom labels and placeholders.