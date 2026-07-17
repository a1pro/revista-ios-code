import * as yup from 'yup';

export const signupValidationSchema = yup.object().shape({
  first_name: yup
    .string()
    .matches(/^[A-Za-z\s]*[A-Za-z][A-Za-z\s]*$/, 'First name must contain only letters and spaces')
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),

  last_name: yup
    .string()
    .matches(/^[A-Za-z]+$/, 'Last name must contain only letters')
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),

  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (@$!%*?&)'
    ),

  // phoneNumber: yup
  //   .string()
  //   .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
  //   .required('Phone number is required'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .test('phone-validation', 'Invalid Saudi phone number', (value) => {
      if (!value) return false;
      
      // Remove Saudi country code if present (+966 or 966)
      let cleaned = value.replace(/^(\+966|966)/, '').trim();
      
      // Remove any non-numeric characters
      cleaned = cleaned.replace(/[^0-9]/g, '');
      
      // Check if empty after cleaning
      if (!cleaned) return false;
      
      // Check if it starts with 5 or 05 (Saudi mobile prefix)
      const startsWith5 = cleaned.startsWith('5') || cleaned.startsWith('05');
      
      // Check length between 9-11 digits (after removing country code)
      const isValidLength = cleaned.length >= 9 && cleaned.length <= 11;
      
      return startsWith5 && isValidLength;
    }),
});
