import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
  TextField,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RHFTextField, FormProvider } from "../../hook-form";
import Iconify from "../../Iconify";
import { useForm, useFieldArray, Controller, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TrainingSchema } from "../../../lib/yup-schema/TrainingSchema";
import { setTrainingsSetup } from "../../../store/slice/TrainingSlice";
import AppTable from "../../AppTable";

const Trainings = () => {
  const dispatch = useDispatch();
  const [trainingData, setTrainingData] = useState([]);
  const { trainings } = useSelector((store) => store.training);

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

  const onSubmit = (data) => {
    console.log(data);
    const newData = {
      id: data.id ? data.id : trainings.length + 1,
      ...data
    }
    dispatch(setTrainingsSetup(newData));
    reset({
      title: "",
      duration: "",
      institution: "",
    });
  };
  console.log(trainings);
  useEffect(() => {
    setTrainingData(
      trainings.map((data) => ({
        title: data.title,
        duration: data.duration,
        institution: data.institution,
        action: (
          <>
            <IconButton
              onClick={() => {
                reset({
                  id: data.id,
                  title: data.title,
                  duration: data.duration,
                  institution: data.institution,
                });
              }}
            >
              <Iconify icon={"tabler:edit"} />
            </IconButton>

            <IconButton
              onClick={() => {
                // onDeactivateHandler(data.id);
              }}
            >
              <Iconify icon={"material-symbols:delete-outline"} />
            </IconButton>
          </>
        ),
      }))
    );
  }, [reset, trainings]);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Stack sx={{ gap: 1, width: "100%" }}>
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
                name={`title`}
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
                name={`duration`}
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
                name={`institution`}
                control={control}
              />
            </Stack>
          </Box>
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
          sx={{ width: "50%", marginTop: 5 }}
          type="submit"
        >
          Submit
        </LoadingButton>
      </FormProvider>
      <Container maxWidth="xl">
        <AppTable
          hasButton={false}
          hasSearch={false}
          TABLE_HEAD={[
            // { id: "id", label: "ID", align: "center" },
            { id: "title", label: "Title", align: "center" },
            { id: "duration", label: "Duration(hours)", align: "center" },
            { id: "institution", label: "Institution", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={trainingData || []}
        />
      </Container>
    </>
  );
};

export default Trainings;
