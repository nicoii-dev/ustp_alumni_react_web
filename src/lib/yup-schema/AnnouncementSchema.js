import * as yup from 'yup';

export const AnnouncementSchema = yup
  .object({
    title: yup.string().required('Title is required'),
    announcement: yup.string().required('Announcement is required'),
  })
  .required();
