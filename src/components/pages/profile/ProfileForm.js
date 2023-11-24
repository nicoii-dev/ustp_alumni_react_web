import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
// form
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import UserAddress from "./UserAddress";

// ----------------------------------------------------------------------

export default function ProfileForm(_props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const steps = ["Personal Info", "Employment Status", "Trainings", "Address"];
  const [activeStep, setActiveStep] = useState(0);

  const defaultValues = {
    houseNumber: "",
    street: "",
    barangay: "",
    formattedAddress: "",
    zipcode: "",
    lat: "",
    lng: "",
  };

  const methods = useForm({
    resolver: yupResolver(),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  // const {
  //   data: profileData,
  //   status: profileStatus,
  //   isLoading: profileIsLoading,
  // } = useQuery(["view-profile"], () => viewProfile(), {
  //   retry: 3, // Will retry failed requests 10 times before displaying an error
  // });

  // useEffect(() => {
  //   setValue("street", address?.street);
  //   setValue("formattedAddress", address?.formattedAddress);
  //   setValue("lat", address?.location?.lat);
  //   setValue("lng", address?.location?.lng);
  // }, [address, setValue]);

  // useEffect(() => {
  //   if(profileStatus === 'success') {
  //     setValue("house_number", profileData?.data?.house_number || "");
  //     setValue("street", profileData?.data?.street);
  //     setValue("barangay", profileData?.data?.barangay);
  //     setValue("zipcode", profileData?.data?.zipcode);
  //     setValue("formattedAddress", profileData?.data?.formatted_address);
  //     setValue("lat", !_.isEmpty(profileData?.data) ? JSON.parse(profileData?.data?.location).lat : '');
  //     setValue("lng", !_.isEmpty(profileData?.data) ? JSON.parse(profileData?.data?.location).lng : '');
  //   }

  // }, [profileData?.data, profileStatus, setValue])

  // const { mutate: create, isLoading: createProfileLoading } = useMutation(
  //   (payload) => createProfile(payload),
  //   {
  //     onSuccess: (data) => {
  //       toast.success("Profile successfully created.");
  //       queryClient.invalidateQueries(["view-profile"]);
  //       setIsLoading(false);
  //     },
  //     onError: (error) => {
  //       toast.error(error.response.data.message);
  //     },
  //   }
  // );

  // const onSubmit = async (data) => {
  //   setIsLoading(true)
  //   const payload = {
  //     house_number: data.houseNumber,
  //     street: data.street,
  //     barangay: data.barangay,
  //     zipcode: data.zipcode,
  //     formatted_address: address.formattedAddress,
  //     location: JSON.stringify({
  //       lat: address.location.lat,
  //       lng: address.location.lng,
  //     }),
  //   };
  //   create(payload);
  // };

  // const { mutate: update, isLoading: updateProfileLoading } = useMutation(
  //   (payload) => updateProfile(payload),
  //   {
  //     onSuccess: (data) => {
  //       queryClient.invalidateQueries(["get-all-shop-services"]);
  //       toast.success("Laundry Service successfully updated.");
  //     },
  //     onError: (error) => {
  //       toast.error(error.response.data.message);
  //     },
  //   }
  // );

  const onUpdate = async (data) => {
    // setIsLoading(true)
    // const payload = {
    //   house_number: data.houseNumber,
    //   street: data.street,
    //   barangay: data.barangay,
    //   zipcode: data.zipcode,
    //   formatted_address: address.formattedAddress,
    //   location: JSON.stringify({
    //     lat: address.location.lat,
    //     lng: address.location.lng,
    //   }),
    // };
    // update(payload);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onUpdate)}>
      <Stepper activeStep={activeStep} sx={{ justifyContent: "center" }}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps} sx={{ cursor: "pointer" }}>
              <StepLabel
                sx={{ cursor: "pointer" }}
                {...labelProps}
                onClick={() => {
                  // if (userData?.data.timezone === null && index === 2) {
                  //   return toast.error('Please set your timezone');
                  // }
                  setActiveStep(index);
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Stack spacing={2}>
        <Box marginTop={5}>
          {activeStep === 0 && (
            <Stack>
              <RHFTextField name="civil_status" label="Civil Status" />
              <RHFTextField name="dob" label="Date of Birth" />
            </Stack>
          )}
        </Box>
        <Box marginTop={5}>
          {activeStep === 1 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <RHFTextField name="type" label="Type" />
              <RHFTextField name="status" label="Status" />
            </Stack>
          )}
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="title" label="Title" />
          <RHFTextField name="duration" label="Duration" />
          <RHFTextField name="institution" label="Institution" />
        </Stack>
        <UserAddress />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          sx={{ alignSelf: "center", width: 200 }}
        >
          Update
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
