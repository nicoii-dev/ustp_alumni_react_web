import * as yup from "yup";

export const TrainingSchema = yup
  .object({
    title: yup
    .string()
    .required("Title is required")
    .min(2, "Title must be atleast 2 letters"),
    duration: yup
      .string()
      .required("Duration is required")
      .matches(/^[0-9]+$/, "Numbers only"),
    institution: yup
      .string()
      .required("Institution is required")
      .min(2, "Institution must be atleast 2 letters"),
  })
  .required();
