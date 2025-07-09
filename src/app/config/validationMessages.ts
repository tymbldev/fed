export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  firstName: 'First name must be at least 2 characters long',
  lastName: 'Last name must be at least 2 characters long',
  title: 'Title must be at least 2 characters long',
  designation: 'Designation must be at least 2 characters long',
  company: 'Company name must be at least 2 characters long',
  yearsOfExperience: 'Years of experience must be a positive number',
  monthsOfExperience: 'Months of experience must be between 0 and 11',
  currentSalary: 'Salary must be a positive number',
  password: 'Password must be at least 8 characters long',
  confirmPassword: 'Passwords do not match',
  department: 'Please select a department',
  location: 'Please select a location',
  skills: 'Please enter at least one skill',
  description: 'Description must be at least 10 characters long',
  url: 'Please enter a valid URL',
  linkedin: 'Please enter a valid LinkedIn profile URL',
  github: 'Please enter a valid GitHub profile URL',
} as const;

export type ValidationMessageKey = keyof typeof validationMessages;