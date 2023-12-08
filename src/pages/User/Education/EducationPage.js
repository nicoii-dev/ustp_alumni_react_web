import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// mui
import {
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import moment from "moment";
// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import {
  RHFTextField,
  RHFDatePicker,
  FormProvider,
} from "../../../components/hook-form";

// api
import educationApi from "../../../lib/services/educationApi";

// schema
import { EducationSchema } from "../../../lib/yup-schema/EducationSchema";

// redux

function EducationPage() {
  const { getUserEducation, updateEducation } = educationApi;
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: educationData,
    status: educationStatus,
    isFetching: educationIsFetching,
  } = useQuery(["get-all-user-education"], () => getUserEducation(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
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
    if (educationStatus === "success") {
      reset({
        collegeSchool: educationData?.data[0]?.college,
        collegeAddress: educationData?.data[0]?.college_address,
        course: educationData?.data[0]?.course,
        collegeSyStart: new Date(
          JSON.parse(educationData?.data[0]?.college_sy)[0],
          0,
          1
        ),
        collegeSyEnd: new Date(
          JSON.parse(educationData?.data[0]?.college_sy)[1],
          0,
          1
        ),
        highSchool: educationData?.data[0]?.high_school,
        highAddress: educationData?.data[0]?.high_address,
        highSyStart: new Date(
          JSON.parse(educationData?.data[0]?.high_sy)[0],
          0,
          1
        ),
        highSyEnd: new Date(
          JSON.parse(educationData?.data[0]?.high_sy)[1],
          0,
          1
        ),
        elemSchool: educationData?.data[0]?.elem_school,
        elemAddress: educationData?.data[0]?.elem_address,
        elemSyStart: new Date(
          JSON.parse(educationData?.data[0]?.elem_sy)[0],
          0,
          1
        ),
        elemSyEnd: new Date(
          JSON.parse(educationData?.data[0]?.elem_sy)[1],
          0,
          1
        ),
      });
    }
  }, [reset, educationData, educationStatus]);

  useEffect(() => {
    educationHandler();
  }, [educationHandler]);

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updateEducation(educationData?.data[0]?.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-user-education"]);
        toast.success(data.data.message);
        setUpdateTrigger(false)
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const educationPayload = {
      college: data.collegeSchool,
      college_address: data.collegeAddress,
      course: data.course,
      college_sy: `[${moment(data.collegeSyStart).format("YYYY")}, ${moment(
        data.collegeSyEnd
      ).format("YYYY")}]`,
      high_school: data.highSchool,
      high_address: data.highAddress,
      high_sy: `[${moment(data.highSyStart).format("YYYY")}, ${moment(
        data.highSyEnd
      ).format("YYYY")}]`,
      elem_school: data.elemSchool,
      elem_address: data.elemAddress,
      elem_sy: `[${moment(data.elemSyStart).format("YYYY")}, ${moment(
        data.elemSyEnd
      ).format("YYYY")}]`,
    };
    await Update(educationPayload)
  };

  return (
    <Page title="Education Background">
      <Box
        sx={{
          backgroundColor: "#CCE5FF",
          padding: 2,
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        <Typography variant="h4">Educational Background</Typography>
      </Box>
      <Container maxWidth="md" sx={{ justifyContent: "center" }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <>
            <Stack>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <Stack sx={{ gap: 1, width: "100%", marginTop: 2 }}>
                  <RHFTextField
                    name="collegeSchool"
                    label="College"
                    disabled={!updateTrigger}
                  />
                  <RHFTextField
                    name="collegeAddress"
                    label="Address"
                    disabled={!updateTrigger}
                  />
                  <RHFTextField
                    name="course"
                    label="Course"
                    disabled={!updateTrigger}
                  />
                  <Stack
                    sx={{
                      gap: 1,
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <RHFDatePicker
                      name="collegeSyStart"
                      label="School Year Start"
                      type="year"
                      disabled={!updateTrigger}
                    />
                    <RHFDatePicker
                      name="collegeSyEnd"
                      label="School Year End"
                      type="year"
                      disabled={!updateTrigger}
                    />
                  </Stack>

                  <RHFTextField
                    name="highSchool"
                    label="High School"
                    disabled={!updateTrigger}
                  />
                  <RHFTextField
                    name="highAddress"
                    label="Address"
                    disabled={!updateTrigger}
                  />
                  <Stack
                    sx={{
                      gap: 1,
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <RHFDatePicker
                      name="highSyStart"
                      label="School Year Start"
                      type="year"
                      disabled={!updateTrigger}
                    />
                    <RHFDatePicker
                      name="highSyEnd"
                      label="School Year End"
                      type="year"
                      disabled={!updateTrigger}
                    />
                  </Stack>
                  <RHFTextField
                    name="elemSchool"
                    label="Elementary"
                    disabled={!updateTrigger}
                  />
                  <RHFTextField
                    name="elemAddress"
                    label="Address"
                    disabled={!updateTrigger}
                  />
                  <Stack
                    sx={{
                      gap: 1,
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <RHFDatePicker
                      name="elemSyStart"
                      label="School Year Start"
                      type="year"
                      disabled={!updateTrigger}
                    />
                    <RHFDatePicker
                      name="elemSyEnd"
                      label="School Year End"
                      type="year"
                      disabled={!updateTrigger}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </>
          {updateTrigger ? (
            <LoadingButton
              variant="contained"
              sx={{
                display: "flex",
                width: "20%",
                position: "absolute",
                marginTop: 5,
                placeSelf: "flex-end",
              }}
              type="submit"
              loading={updateIsLoading}
            >
              Save
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              sx={{
                display: "flex",
                width: "20%",
                position: "absolute",
                marginTop: 5,
                placeSelf: "flex-end",
              }}
              type="button"
              onClick={() => setUpdateTrigger(true)}
            >
              Update
            </Button>
          )}
        </FormProvider>
      </Container>
    </Page>
  );
}

export default EducationPage;
