import { validationMessages } from '../config/validationMessages';

export const validateField = (name: string, value: string, required: boolean): string | undefined => {
  if (required && !value) {
    if (name === 'uniqueUrl') {
      return validationMessages.uniqueUrl;
    }
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
        if (!/^\d+-\d{7,10}$/.test(value)) {
          return validationMessages.phone;
        }
        const [isd, phone] = value.split('-');
        if (isd.length < 2 || isd.length > 3 || phone.length < 7 || phone.length > 10) {
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
      case 'minSalary':
      case 'maxSalary':
        if (isNaN(Number(value)) || Number(value) < 0) {
          return validationMessages.salary;
        }
        break;
      case 'minExperience':
      case 'maxExperience':
        if (isNaN(Number(value)) || Number(value) < 0) {
          return validationMessages.experience;
        }
        break;
      case 'jobType':
        if (!value) {
          return validationMessages.jobType;
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
      case 'tags':
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
      case 'personalWebsite':
      case 'portfolioWebsite':
      case 'uniqueUrl':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          return validationMessages.url;
        }
        break;
      case 'linkedin':
      case 'linkedInProfile':
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/.test(value)) {
          return validationMessages.linkedin;
        }
        break;
      case 'github':
      case 'githubProfile':
        if (value && !/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(value)) {
          return validationMessages.github;
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