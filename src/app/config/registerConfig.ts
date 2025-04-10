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
      { value: 'job-seeker', label: 'Job Seeker' },
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

    city: [
      { value: 'san-francisco', label: 'San Francisco' },
      { value: 'new-york', label: 'New York' },
      { value: 'seattle', label: 'Seattle' },
      { value: 'boston', label: 'Boston' },
      { value: 'austin', label: 'Austin' },
    ],

    country: [
      { value: 'united-states', label: 'United States' },
      { value: 'canada', label: 'Canada' },
      { value: 'united-kingdom', label: 'United Kingdom' },
      { value: 'australia', label: 'Australia' },
      { value: 'india', label: 'India' },
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
    city: {
      id: 'city',
      name: 'city',
      label: 'City',
      placeholder: 'Select your city',
      required: true,
    },
    country: {
      id: 'country',
      name: 'country',
      label: 'Country',
      placeholder: 'Select your country',
      required: true,
    },
    // zipCode: {
    //   id: 'zipCode',
    //   name: 'zipCode',
    //   label: 'ZIP Code',
    //   placeholder: 'Enter your ZIP code',
    //   required: true,
    // },
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
    city: {
      required: 'Please select your city'
    },
    country: {
      required: 'Please select your country'
    },
    zipCode: {
      required: 'ZIP code is required',
      format: 'Please enter a valid ZIP code'
    }
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