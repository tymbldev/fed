export const registerConfig = {
  steps: {
    total: 4,
    labels: {
      1: 'Account Details',
      2: 'Personal Information',
      3: 'Professional Details',
      4: 'Location Information'
    }
  },

  options: {
    role: [
      { value: 'referral-seeker', label: 'Referral Seeker' },
      { value: 'employer', label: 'Employer' },
      { value: 'recruiter', label: 'Recruiter' },
    ],

    designation: [
      { value: 'software-engineer', label: 'Software Engineer' },
      { value: 'product-manager', label: 'Product Manager' },
      { value: 'designer', label: 'Designer' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
    ],

    department: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'product', label: 'Product' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'hr', label: 'HR' },
    ],
  },

  fields: {
    email: {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email',
    },
    password: {
      id: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Create a password',
      required: true,
      autoComplete: 'new-password',
    },
    firstName: {
      id: 'firstName',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
    },
    lastName: {
      id: 'lastName',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: true,
    },
    role: {
      id: 'role',
      name: 'role',
      label: 'Role',
      placeholder: 'Select your role',
      required: true,
    },
    phone: {
      id: 'phone',
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: true,
    },
    company: {
      id: 'company',
      name: 'company',
      label: 'Company',
      placeholder: 'Enter your company name',
      required: true,
    },
    designation: {
      id: 'designation',
      name: 'designation',
      label: 'Designation',
      placeholder: 'Select your designation',
      required: true,
    },
    department: {
      id: 'department',
      name: 'department',
      label: 'Department',
      placeholder: 'Select your department',
      required: true,
    },
    country: {
      id: 'country',
      name: 'country',
      label: 'Country',
      placeholder: 'Select your country',
      required: true,
    },
    state: {
      id: 'state',
      name: 'state',
      label: 'State',
      placeholder: 'Select your state',
      required: true,
    },
    city: {
      id: 'city',
      name: 'city',
      label: 'City',
      placeholder: 'Select your city',
      required: true,
    },
    cityOther: {
      id: 'cityOther',
      name: 'cityOther',
      label: 'Other City',
      placeholder: 'Enter your city name',
      required: true,
    },
    yearsOfExperience: {
      id: 'yearsOfExperience',
      name: 'yearsOfExperience',
      type: 'number',
      label: 'Years of Experience',
      placeholder: 'Enter years of experience',
      required: true,
      autoComplete: 'off'
    },
    skills: {
      id: 'skills',
      name: 'skills',
      type: 'text',
      label: 'Skills',
      placeholder: 'Enter skills separated by commas',
      required: true,
      autoComplete: 'off'
    },
  },

  errorMessages: {
    required: 'This field is required',
    email: {
      format: 'Please enter a valid email address',
      required: 'Email address is required'
    },
    password: {
      required: 'Password is required',
      minLength: 'Password must be at least 6 characters'
    },
    firstName: {
      required: 'First name is required'
    },
    lastName: {
      required: 'Last name is required'
    },
    role: {
      required: 'Please select your role'
    },
    phone: {
      required: 'Phone number is required',
      format: 'Please enter a valid phone number'
    },
    company: {
      required: 'Company name is required'
    },
    designation: {
      required: 'Please select your designation'
    },
    department: {
      required: 'Please select your department'
    },
    country: {
      required: 'Please select your country'
    },
    state: {
      required: 'Please select your state'
    },
    city: {
      required: 'Please select your city'
    },
    cityOther: {
      required: 'Please enter your city name'
    },
    skills: {
      required: 'Please select at least one skill'
    },
  },

  styles: {
    button: {
      primary: "px-6 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1a73e8]/90 transition duration-200",
      secondary: "px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200",
    },
    progressBar: {
      background: "bg-gradient-to-r from-[#1a73e8] to-[#34c759]",
      container: "bg-gray-200",
    },
    heading: {
      gradient: "bg-gradient-to-r from-[#1a73e8] to-[#34c759] text-transparent bg-clip-text",
    }
  }
};