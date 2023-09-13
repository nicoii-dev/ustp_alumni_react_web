import * as yup from 'yup';

export const LabanderoSchema = yup
  .object({
    houseNumber: yup.string(),
    street: yup.string().required('Street is required'),
    barangay: yup.string().required('Barangay name is required'),
    formattedAddress: yup.string().required('Formatted address is required'),
    zipcode: yup.string().required('Zipcode is required'),
  })
  .required();
