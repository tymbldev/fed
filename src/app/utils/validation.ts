import { validationMessages } from '../config/validationMessages';

export const validateField = (name: string, value: string, required: boolean): string | undefined => {
  if (required && !value) {
    return validationMessages.required;
  }
  if (value) {  // Only validate format if there is a value
    switch (name) {
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          return validationMessages.email;
        }
        break;
      case 'phone':
        if (!/^\+?[\d\s-]{10,}$/.test(value)) {
          return validationMessages.phone;
        }
        break;
      case 'firstName':
        if (value.length < 2) {
          return validationMessages.firstName;
        }
        break;
      case 'lastName':
        if (value.length < 2) {
          return validationMessages.lastName;
        }
        break;
      case 'designation':
        if (value.length < 2) {
          return validationMessages.designation;
        }
        break;
      case 'company':
        if (value.length < 2) {
          return validationMessages.company;
        }
        break;
      case 'yearsOfExperience':
        if (isNaN(Number(value)) || Number(value) < 0) {
          return validationMessages.yearsOfExperience;
        }
        break;
      case 'monthsOfExperience':
        if (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 11) {
          return validationMessages.monthsOfExperience;
        }
        break;
      case 'currentSalary':
        if (isNaN(Number(value)) || Number(value) < 0) {
          return validationMessages.currentSalary;
        }
        break;
      case 'currentSalaryCurrencyId':
        if (!value) {
          return validationMessages.required;
        }
        break;
      case 'password':
        if (value.length < 8) {
          return validationMessages.password;
        }
        break;
      case 'confirmPassword':
        // Note: This requires the password value to be passed separately
        if (value.length < 8) {
          return validationMessages.password;
        }
        break;
      case 'department':
        if (!value) {
          return validationMessages.department;
        }
        break;
      case 'countryId':
        if (!value) {
          return validationMessages.location;
        }
        break;
      case 'cityId':
        if (!value) {
          return validationMessages.location;
        }
        break;
      case 'skillNames':
        if (!value) {
          return validationMessages.skills;
        }
        break;
      case 'title':
        if (value.length < 2) {
          return validationMessages.title;
        }
        break;
      case 'description':
        if (value.length < 10) {
          return validationMessages.description;
        }
        break;
    }
  }
  return undefined;
};

// Helper function to validate multiple fields at once
export const validateFields = (
  fields: { name: string; value: string; required: boolean }[]
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  fields.forEach(field => {
    const error = validateField(field.name, field.value, field.required);
    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
};