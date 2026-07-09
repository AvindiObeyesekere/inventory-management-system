import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});
