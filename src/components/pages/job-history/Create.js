import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RHFTextField, FormProvider, RHFDatePicker } from "../../hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import jobHistoryApi from "../../../lib/services/jobHistoryApi";
import { JobHistorySchema } from "../../../lib/yup-schema/JobHistorySchema";
import jobHistoryType from "../../../lib/json-data/jobHistoryStatus.json";

const CreateJobHistory = ({ handleClose }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { createJobHistory } = jobHistoryApi;

  const defaultValues = {
    company: "",
    position: "",
    dateStarted: "",
    dateEnded: "",
    salary: "",
    status: "Currently Employed",
  };

  const methods = useForm({
    resolver: yupResolver(JobHistorySchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { mutate: create, isLoading: createIsLoading } = useMutation(
    (payload) => createJobHistory(payload),
    {
      onSuccess: (data) => {
        toast.success("Job History Added Successfully");
        queryClient.invalidateQueries(["get-all-user-job-history"]);
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
        company: data.company,
        position: data.position,
        date_started: data.dateStarted,
        date_ended: data.dateEnded,
        salary: data.salary,
        status: data.status
    }
    await create(payload);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Stack sx={{ marginTop: 1, width: "100%", gap: 1 }}>
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="position" label="Position" />
              <RHFDatePicker
                name="dateStarted"
                label="Date Started"
                type="date"
              />
              <RHFDatePicker name="dateEnded" label="Date Ended" type="date" />
              <RHFTextField name="salary" label="Salary" />
              <RHFTextField
                name="status"
                label="Status"
                inputType="dropDown"
                dropDownData={jobHistoryType}
              />
            </Stack>
          </Box>
        </Stack>

        <LoadingButton
          variant="contained"
          sx={{ width: "50%", marginTop: 5 }}
          type="submit"
          loading={createIsLoading}
        >
          Save
        </LoadingButton>
      </FormProvider>
    </>
  );
};

export default CreateJobHistory;
