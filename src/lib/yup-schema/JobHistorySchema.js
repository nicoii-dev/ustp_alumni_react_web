import * as yup from "yup";

export const JobHistorySchema = yup
  .object({
    company: yup.string().required("Company is required"),
    position: yup.string().required("Position is required"),
    dateStarted: yup.string().required("Date started is required"),
    dateEnded: yup.string().required("Date ended is required"),
    salary: yup
      .string()
      .required("Salary is required")
      .matches(/^[0-9]+$/, "Numbers only"),
    status: yup.string().required("Status is required"),
  })
  .required();
