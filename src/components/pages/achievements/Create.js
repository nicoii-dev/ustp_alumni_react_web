import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RHFTextField, FormProvider, RHFDatePicker } from "../../hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import achievementsApi from "../../../lib/services/achievementsApi";
import jobHistoryType from "../../../lib/json-data/jobHistoryStatus.json";
import { AchievementSchema } from "../../../lib/yup-schema/AchievementSchema";

const CreateAchievement = ({ handleClose }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { createAchievements } = achievementsApi;

  const defaultValues = {
    title: "",
    category: "",
    date: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(AchievementSchema),
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
    (payload) => createAchievements(payload),
    {
      onSuccess: (data) => {
        toast.success("Achievement Added Successfully");
        queryClient.invalidateQueries(["get-all-user-achievements"]);
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      category: data.category,
      date: data.date,
      description: data.description,
    };
    await create(payload);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Stack sx={{ marginTop: 1, width: "100%", gap: 1 }}>
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="category" label="Category" />
              <RHFDatePicker name="date" label="Date" type="date" />
              <RHFTextField name="description" label="Description" />
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

export default CreateAchievement;
