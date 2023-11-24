import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import {useMutation, useQueryClient } from "react-query";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RHFTextField, FormProvider } from "../../hook-form";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TrainingSchema } from "../../../lib/yup-schema/TrainingSchema";
import trainingApi from "../../../lib/services/trainingApi";

const UpdateTrainingComponent = ({handleClose}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { updateTraining } = trainingApi;
  const { training } = useSelector((store) => store.training);
  console.log(training)

  const defaultValues = {
    title: "",
    duration: "",
    institution: "",
  };

  const methods = useForm({
    resolver: yupResolver(TrainingSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { mutate: update, isLoading: createIsLoading } = useMutation(
    (payload) => updateTraining(payload, training.id),
    {
      onSuccess: (data) => {
        toast.success("Training Added Successfully");
        queryClient.invalidateQueries(["get-all-user-training"]);
        handleClose()
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  useEffect(() => {
    reset({
        title: training.title,
        duration: training.duration,
        institution: training.institution
    })
  }, [reset, training])

  const onSubmit = async (training) => {
    const payload = {
      data: [training],
    };
    await update(payload)
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Stack sx={{ marginTop: 1, width: "100%", gap: 1 }}>
              <RHFTextField name={"title"} placeholder="Title" label="Title" />
              <RHFTextField
                name={"duration"}
                placeholder="Duration(hours)"
                label="Duration(hours)"
              />
              <RHFTextField
                name={"institution"}
                placeholder="Institution"
                label="Institution"
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
          Update
        </LoadingButton>
      </FormProvider>
    </>
  );
};

export default UpdateTrainingComponent;
