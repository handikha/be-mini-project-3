import * as Yup from 'yup';

export const RegisterValidationSchema = Yup.object({
  fullName: Yup.string().required('Username is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
});
