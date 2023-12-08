import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
  TextField,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RHFTextField, FormProvider, RHFDatePicker } from "../../hook-form";
import Iconify from "../../Iconify";
import { useForm, useFieldArray, Controller, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TrainingSchema } from "../../../lib/yup-schema/TrainingSchema";
import { removeTraining, setTrainingsSetup } from "../../../store/slice/TrainingSlice";
import AppTable from "../../AppTable";

const Trainings = () => {
  const dispatch = useDispatch();
  const [trainingData, setTrainingData] = useState([]);
  const { trainings } = useSelector((store) => store.training);

  const defaultValues = {
    topic: "",
    title: "",
    date: "",
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
      ...data,
    };
    dispatch(setTrainingsSetup(newData));
    reset({
      topic: "",
      title: "",
      date: "",
      duration: "",
      institution: "",
    });
  };
  console.log(trainings);
  useEffect(() => {
    setTrainingData(
      trainings.map((data) => ({
        title: data.title,
        topic: data.topic,
        date: moment(data.date).format("LL"),
        duration: data.duration,
        institution: data.institution,
        action: (
          <>
            <IconButton
              onClick={() => {
                reset({
                  id: data.id,
                  title: data.title,
                  topic: data.topic,
                  date: data.date,
                  duration: data.duration,
                  institution: data.institution,
                });
              }}
            >
              <Iconify icon={"tabler:edit"} />
            </IconButton>

            <IconButton
              onClick={() => {
                dispatch(removeTraining(data.id))
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
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="topic" label="Topic" />
              <RHFDatePicker name="date" label="Date" type="date" />
              <RHFTextField name="duration" label="Duration" />
              <RHFTextField name="institution" label="Institution" />
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
            { id: "title", label: "Title", align: "center" },
            { id: "topic", label: "Topic", align: "center" },
            { id: "date", label: "Date", align: "center" },
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
