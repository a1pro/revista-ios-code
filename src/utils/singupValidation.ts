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

  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
});
