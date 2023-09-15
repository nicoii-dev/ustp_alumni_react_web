import * as yup from 'yup';

export const ServiceSchema = yup
  .object({
    serviceName: yup.string(),
    price: yup.string().required('Service price is required').matches(/^[0-9]+$/, 'Numbers only'),
  })
  .required();
