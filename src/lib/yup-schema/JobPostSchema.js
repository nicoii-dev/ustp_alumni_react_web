import * as yup from 'yup';

export const JobPostSchema = yup
  .object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
  })
  .required();
