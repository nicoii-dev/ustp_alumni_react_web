import * as yup from "yup";

export const EducationSchema = yup
  .object({
    collegeSchool: yup
      .string()
      .required("College is required")
      .min(2, "College must be atleast 2 letters"),
    collegeAddress: yup.string().required("Address is required"),
    course: yup.string().required("Course is required"),
    collegeSyStart: yup.string().required("College school year is required"),
    collegeSyEnd: yup.string().required("College school year is required"),
    highSchool: yup
      .string()
      .required("High School is required")
      .min(2, "High School must be atleast 2 letters"),
    highAddress: yup
      .string()
      .required("High School is required")
      .min(2, "High School must be atleast 2 letters"),
      highSyStart: yup.string().required("High school year is required"),
      highSyEnd: yup.string().required("High school year is required"),
    elemSchool: yup
      .string()
      .required("High School is required")
      .min(2, "High School must be atleast 2 letters"),
    elemAddress: yup
      .string()
      .required("High School is required")
      .min(2, "High School must be atleast 2 letters"),
      elemSyStart: yup.string().required("Elem school year is required"),
      elemSyEnd: yup.string().required("Elem school year is required"),
  })
  .required();
