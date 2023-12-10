import * as yup from 'yup';

export const UpdateProfileSchema = yup
  .object({
    dob: yup.string().required('Date of birth is required'),
    civilStatus: yup.string().required('Civil status is required'),
    gender: yup.string().required('Gender is required'),
    phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Numbers only').min(11, 'Phone number must be 11 digits').matches(/^(09|\+639)\d{9}$/gm, 'Invalid phone number'),
  })
  .required();
