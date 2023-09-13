import * as yup from 'yup';

export const ShopRegistrationSchema = yup
  .object({
    shopName: yup.string().required('Shop name is required').min(2, 'Shop name must be atleast 2 letters'),
    buildingNumber: yup.string(),
    street: yup.string().required('Street is required'),
    barangay: yup.string().required('Barangay name is required'),
    formattedAddress: yup.string().required('Formatted address is required'),
    // city: yup.string().required('City is required'),
    // province: yup.string().required('Province is required'),
    zipcode: yup.string().required('Zipcode is required'),
    // location: yup.string().required('Location is required'),
  })
  .required();
