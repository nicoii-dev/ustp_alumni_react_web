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
import { Stack, IconButton, InputAdornment, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { LabanderoSchema } from "../../../lib/yup-schema/LabanderoSchema";
// api
import labanderoApi from "../../../lib/services/labanderoApi";
import { setProfile } from "../../../store/slice/LabanderoSlice";

// ----------------------------------------------------------------------

export default function ProfileForm(_props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { createProfile, updateProfile, viewProfile } = labanderoApi;
  const { address } = useSelector((store) => store.address);
  const [isLoading, setIsLoading] = useState(false);

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
    resolver: yupResolver(LabanderoSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;


  const {
    data: profileData,
    status: profileStatus,
    isLoading: profileIsLoading,
  } = useQuery(["view-profile"], () => viewProfile(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    setValue("street", address?.street);
    setValue("formattedAddress", address?.formattedAddress);
    setValue("lat", address?.location?.lat);
    setValue("lng", address?.location?.lng);
  }, [address, setValue]);

  useEffect(() => {
    if(profileStatus === 'success') {
      setValue("house_number", profileData?.data?.house_number || "");
      setValue("street", profileData?.data?.street);
      setValue("barangay", profileData?.data?.barangay);
      setValue("zipcode", profileData?.data?.zipcode);
      setValue("formattedAddress", profileData?.data?.formatted_address);
      setValue("lat", !_.isEmpty(profileData?.data) ? JSON.parse(profileData?.data?.location).lat : '');
      setValue("lng", !_.isEmpty(profileData?.data) ? JSON.parse(profileData?.data?.location).lng : '');
      dispatch(setProfile(profileData.data))
    }

  }, [profileData?.data, profileStatus, setValue])

  const { mutate: create, isLoading: createProfileLoading } = useMutation(
    (payload) => createProfile(payload),
    {
      onSuccess: (data) => {
        toast.success("Profile successfully created.");
        queryClient.invalidateQueries(["view-profile"]);
        setIsLoading(false);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    setIsLoading(true)
    const payload = {
      house_number: data.houseNumber,
      street: data.street,
      barangay: data.barangay,
      zipcode: data.zipcode,
      formatted_address: address.formattedAddress,
      location: JSON.stringify({
        lat: address.location.lat,
        lng: address.location.lng,
      }),
    };
    create(payload);
  };

  const { mutate: update, isLoading: updateProfileLoading } = useMutation(
    (payload) => updateProfile(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-shop-services"]);
        toast.success("Laundry Service successfully updated.");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onUpdate = async (data) => {
    setIsLoading(true)
    const payload = {
      house_number: data.houseNumber,
      street: data.street,
      barangay: data.barangay,
      zipcode: data.zipcode,
      formatted_address: address.formattedAddress,
      location: JSON.stringify({
        lat: address.location.lat,
        lng: address.location.lng,
      }),
    };
    update(payload);
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(!_.isEmpty(profileData?.data) ? onUpdate : onSubmit)}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="houseNumber" label="House number" />
          <RHFTextField name="street" label="Street" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="barangay" label="Barangay" />
          <RHFTextField name="zipcode" label="Zipcode" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}></Stack>
        <RHFTextField
          name="formattedAddress"
          label="Formatted address"
          disabled
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="lat" label="Latitude" disabled />
          <RHFTextField name="lng" label="Longitude" disabled />
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            width: "50%",
            alignContent: "end",
            alignSelf: "end",
            alignItems: 'end',
            justifyContent: 'end',
 
          }}
          spacing={2}
        >
          {/* <Button
            variant="outlined"
            color="error"
            sx={{ width: "50%" }}
            onClick={() => {
              _props.handleClose();
            }}
          >
            Close
          </Button> */}
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
            sx={{ alignSelf: 'end', width: 200}}
          >
            {!_.isEmpty(profileData?.data) ? "Update" : "Create"}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
