import React, { useEffect, useState, useCallback } from "react";
import { Stack, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RHFTextField, FormProvider, RHFDatePicker } from "../../hook-form";
import { useForm } from "react-hook-form";
import {toast} from 'react-toastify'
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { EducationSchema } from "../../../lib/yup-schema/EducationSchema";
import { useDispatch } from "react-redux";
import { setEducation } from "../../../store/slice/EducationalBackgroundSlice";

const EducationalBackground = ({setActiveStep, activeStep}) => {
  const { education } = useSelector((store) => store.education);
  const dispatch = useDispatch();
  const defaultValues = {
    collegeSchool: "",
    collegeAddress: "",
    course: "",
    collegeSyStart: "",
    collegeSyEnd: "",
    highSchool: "",
    highAddress: "",
    highSyStart: "",
    highSyEnd: "",
    elemSchool: "",
    elemAddress: "",
    elemSyStart: "",
    elemSyEnd: "",
  };

  const methods = useForm({
    resolver: yupResolver(EducationSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const educationHandler = useCallback(() => {
    reset({
      collegeSchool: education.collegeSchool,
      collegeAddress: education.collegeAddress,
      course: education.course,
      collegeSyStart: education.collegeSyStart,
      collegeSyEnd: education.collegeSyEnd,
      highSchool: education.highSchool,
      highAddress: education.highAddress,
      highSyStart: education.highSyStart,
      highSyEnd: education.highSyEnd,
      elemSchool: education.elemSchool,
      elemAddress: education.elemAddress,
      elemSyStart: education.elemSyStart,
      elemSyEnd: education.elemSyEnd,
    })
  }, [reset, education])

  useEffect(() => {
    educationHandler()
  }, [educationHandler])

  const onSubmit = (data) => {
    dispatch(setEducation(data));
    toast.success("Saved locally.")
    setActiveStep(activeStep + 1)
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box
            sx={{
              display: "flex",
              width: "80%",
              height: "55vh",
              overflow: "auto",
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center', 
            }}
          >
            <Stack sx={{ gap: 1, width: "100%", marginTop: 2 }}>
              <RHFTextField name="collegeSchool" label="College" />
              <RHFTextField name="collegeAddress" label="Address" />
              <RHFTextField name="course" label="Course" />
              <Stack
                sx={{
                  gap: 1,
                  justifyContent: "space-evenly",
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <RHFDatePicker
                  name="collegeSyStart"
                  label="School Year Start"
                  type="year"
                />
                <RHFDatePicker
                  name="collegeSyEnd"
                  label="School Year End"
                  type="year"
                />
              </Stack>

              <RHFTextField name="highSchool" label="High School" />
              <RHFTextField name="highAddress" label="Address" />
              <Stack
                sx={{
                  gap: 1,
                  justifyContent: "space-evenly",
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <RHFDatePicker
                  name="highSyStart"
                  label="School Year Start"
                  type="year"
                />
                <RHFDatePicker
                  name="highSyEnd"
                  label="School Year End"
                  type="year"
                />
              </Stack>
              <RHFTextField name="elemSchool" label="Elementary" />
              <RHFTextField name="elemAddress" label="Address" />
              <Stack
                sx={{
                  gap: 1,
                  justifyContent: "space-evenly",
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <RHFDatePicker
                  name="elemSyStart"
                  label="School Year Start"
                  type="year"
                />
                <RHFDatePicker
                  name="elemSyEnd"
                  label="School Year End"
                  type="year"
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <LoadingButton
          variant="contained"
          sx={{ width: "50%", marginTop: 5 }}
          type="submit"
        >
          Submit
        </LoadingButton>
      </FormProvider>
    </>
  );
};

export default EducationalBackground;
