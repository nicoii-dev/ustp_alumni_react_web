import React, { useState } from "react";
import {
  Stack,
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RHFTextField, FormProvider } from "../../hook-form";
import Iconify from "../../Iconify";
import { useForm, useFieldArray, Controller, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TrainingSchema } from "../../../lib/yup-schema/TrainingSchema";

const Trainings = () => {
  const defaultValues = {
    training: [
      {
        title: "",
        duration: "",
        institution: "",
      },
    ],
  };

  //   const {
  //     register,
  //     control,
  //     handleSubmit,
  //     reset,
  //     trigger,
  //     setError,
  //     formState: { errors },
  //   } = useForm({
  //     resolver: yupResolver(TrainingSchema),
  //     mode: "onChange",
  //     defaultValues,
  //   });

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(TrainingSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "training",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        {fields.map((item, index) => (
          <>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Stack key={item.id} sx={{ gap: 1, width: "100%" }}>
                <Controller
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      placeholder="Title"
                    />
                  )}
                  name={`training.${index}.title`}
                  control={control}
                />
                <Controller
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      placeholder="Duration"
                    />
                  )}
                  name={`training.${index}.duration`}
                  control={control}
                />
                <Controller
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      placeholder="Institution"
                    />
                  )}
                  name={`training.${index}.institution`}
                  control={control}
                />
              </Stack>
              <IconButton
                onClick={() => remove(index)}
                sx={{ placeSelf: "center" }}
                disabled={index === 0}
              >
                <Iconify
                  icon={"mdi:remove-box-outline"}
                  sx={{ color: "red" }}
                  height={30}
                  width={30}
                />
              </IconButton>
            </Box>
            <IconButton
              onClick={() =>
                append({ title: "", duration: "", institution: "" })
              }
              sx={{ placeSelf: "flex-end" }}
            >
              <Iconify
                icon={"icon-park-outline:add"}
                sx={{ color: "#0080FF" }}
                height={30}
                width={30}
              />
            </IconButton>
          </>
        ))}
      </Stack>
      {/* <button
        type="button"
        onClick={() => append({ title: "", duration: "", institution: "" })}
      >
        append
      </button> */}
      <LoadingButton
        // loading={}
        // sx={{ backgroundColor: "#0080FF", width: "95%", color: "white" }}
        variant="contained"
        sx={{ width: "50%" }}
        type="submit"
      >
        Submit
      </LoadingButton>
    </form>
  );
};

export default Trainings;
