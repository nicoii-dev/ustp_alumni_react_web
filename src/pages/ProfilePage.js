import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  regions,
  provinces,
  cities,
  barangays,
  provinceByName,
} from "select-philippines-address";
// mui
import {
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import moment from "moment";
// components
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import civilStatusList from "../lib/json-data/civilStatus.json";
import MyDropzone from "../components/dropzone/Dropzone";

import {
  RHFTextField,
  RHFDatePicker,
  FormProvider,
} from "../components/hook-form";

// api
import userApi from "../lib/services/userApi";

// schema
import { UpdateProfileSchema } from "../lib/yup-schema/UpdateProfileSchema";

// redux
import {
  setUserRegion,
  setUserProvince,
  setUserCity,
  setUserBarangay,
  setUserStreet,
  setUserZipcode,
} from "../store/slice/AddressSlice";
import { setImage, setProfileImage } from "../store/slice/SetupProfileSlice";

const genderData = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

function ProfilePage() {
  const dispatch = useDispatch();
  const { getProfile, updateProfile } = userApi;
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const queryClient = useQueryClient();
  const { image } = useSelector((store) => store.profileSetup);

  const [regionData, setRegion] = useState([]);
  const [provinceData, setProvince] = useState([]);
  const [cityData, setCity] = useState([]);
  const [barangayData, setBarangay] = useState([]);

  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");

  const {
    userRegion,
    userProvince,
    userCity,
    userBarangay,
    userStreet,
    userZipcode,
  } = useSelector((store) => store.address);

  const region = () => {
    regions().then((response) => {
      setRegion(
        response.map((data) => ({
          id: data.id,
          code: data.region_code,
          value: data.region_code,
          label: data.region_name,
        }))
      );
    });
  };

  const province = (e) => {
    setRegionCode(e.target.value);
    dispatch(setUserRegion(e.target.selectedOptions[0].text));
    provinces(e.target.value).then((response) => {
      console.log(response);
      setProvince(
        response.map((data) => ({
          value: data.province_code,
          label: data.province_name,
        }))
      );
      setCity([]);
      setBarangay([]);
      dispatch(setUserCity(""));
      dispatch(setUserBarangay(""));
    });
  };

  const city = (e) => {
    setProvinceCode(e.target.value);
    dispatch(setUserProvince(e.target.selectedOptions[0].text));
    cities(e.target.value).then((response) => {
      setCity(
        response.map((data) => ({
          value: data.city_code,
          label: data.city_name,
        }))
      );
    });
  };

  const barangay = (e) => {
    setCityCode(e.target.value);
    dispatch(setUserCity(e.target.selectedOptions[0].text));
    barangays(e.target.value).then((response) => {
      setBarangay(
        response.map((data) => ({
          value: data.brgy_code,
          label: data.brgy_name,
        }))
      );
    });
  };

  const brgy = (e) => {
    setBarangayCode(e.target.value);
    dispatch(setUserBarangay(e.target.selectedOptions[0].text));
  };

  useEffect(() => {
    region();
  }, []);

  const { data: profileData, status: profileStatus } = useQuery(
    ["get-user-profile"],
    () => getProfile(),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );
  const defaultValues = {
    civil_status: "",
    dob: "",
    gender: "",
    phoneNumber: "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateProfileSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;
  console.log(profileData);

  const educationHandler = useCallback(() => {
    if (profileStatus === "success") {
      dispatch(setProfileImage(profileData?.data?.image));
      reset({
        civilStatus: profileData?.data?.civil_status,
        dob: profileData?.data?.dob,
        gender: profileData?.data?.gender,
        phoneNumber: profileData?.data?.phone_number,
      });

      setRegionCode(profileData?.data?.address?.region_code);
      provinces(profileData?.data?.address?.region_code).then((response) => {
        console.log(response);
        setProvince(
          response.map((data) => ({
            value: data.province_code,
            label: data.province_name,
          }))
        );
      });

      setProvinceCode(profileData?.data?.address?.province_code);
      cities(profileData?.data?.address?.province_code).then((response) => {
        setCity(
          response.map((data) => ({
            value: data.city_code,
            label: data.city_name,
          }))
        );
      });

      setCityCode(profileData?.data?.address?.city_code);
      barangays(profileData?.data?.address?.city_code).then((response) => {
        setBarangay(
          response.map((data) => ({
            value: data.brgy_code,
            label: data.brgy_name,
          }))
        );
      });

      setBarangayCode(profileData?.data?.address?.barangay_code);

      dispatch(setUserRegion(profileData?.data?.address?.region));
      dispatch(setUserProvince(profileData?.data?.address?.province));
      dispatch(setUserCity(profileData?.data?.address?.city));
      dispatch(setUserBarangay(profileData?.data?.address?.barangay));
      dispatch(setUserStreet(profileData?.data?.address?.street));
      dispatch(setUserZipcode(profileData?.data?.address?.zipcode));
    }
  }, [reset, profileData, profileStatus]);

  useEffect(() => {
    educationHandler();
  }, [educationHandler]);

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (payload) => updateProfile(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-user-profile"]);
        toast.success(data.data.message);
        setUpdateTrigger(false);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    // const profilePayload = {
    //   civil_status: data.civilStatus,
    //   dob: moment(data.dob).format("YYYY-MM-DD"),
    //   gender: data.gender,
    //   phone_number: data.phoneNumber,
    //   street: userStreet,
    //   barangay: userBarangay,
    //   barangay_code: barangayCode,
    //   city: userCity,
    //   city_code: cityCode,
    //   province: userProvince,
    //   province_code: provinceCode,
    //   region: userRegion,
    //   region_code: regionCode,
    //   zipcode: userZipcode,
    // };
    // console.log(profilePayload);
    const formData = new FormData();
    formData.append("civil_status", data.civil_status);
    formData.append("dob", moment(data.dob).format("YYYY-MM-DD"));
    formData.append("image", image[0].file);
    formData.append("gender", data.gender);
    formData.append("phone_number", data.phoneNumber);
    formData.append("street", userStreet);
    formData.append("barangay", userBarangay);
    formData.append("barangay_code", barangayCode);
    formData.append("city", userCity);
    formData.append("city_code", cityCode);
    formData.append("province", userProvince);
    formData.append("province_code", provinceCode);
    formData.append("region", userRegion);
    formData.append("region_code", regionCode);
    formData.append("zipcode", userZipcode);
    await Update(formData);
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
        <Typography variant="h4">Profile</Typography>
      </Box>
      <Container maxWidth="md" sx={{ justifyContent: "center" }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {updateTrigger ? (
              <LoadingButton
                variant="contained"
                sx={{
                  width: "20%",
                  marginTop: 0,
                }}
                type="submit"
                loading={updateIsLoading}
                disabled={
                  _.isEmpty(userRegion) ||
                  _.isEmpty(userProvince) ||
                  _.isEmpty(userCity) ||
                  _.isEmpty(userBarangay) ||
                  _.isEmpty(userStreet) ||
                  _.isEmpty(userZipcode)
                }
              >
                Save
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                sx={{
                  width: "20%",
                  marginTop: 0,
                }}
                type="button"
                onClick={() => setUpdateTrigger(true)}
              >
                Update
              </Button>
            )}
          </Box>
          <>
            <Stack>
              <Box>
                {updateTrigger ? (
                  <Box sx={{width: 200}}>

                  <MyDropzone images={image} setImages={setImage} maxFile={1} />
                  </Box>
                ) : (
                  <img
                    alt="profile"
                    src={
                      profileData?.data?.image
                        ? `${process.env.REACT_APP_API_LOCAL_URL}/storage/${profileData?.data?.image}`
                        : "/static/ustp-logo.jpg"
                    }
                    style={{
                      height: 120,
                      width: 120,
                      marginBottom: 10,
                      justifyContent: "center",
                      justifySelf: "center",
                      alignSelf: "center",
                      borderRadius: 150,
                    }}
                  />
                )}
              </Box>
              <Stack spacing={2} sx={{ marginTop: 5 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField
                    name="civilStatus"
                    label="Civil Status"
                    inputType="dropDown"
                    dropDownData={civilStatusList}
                    disabled={!updateTrigger}
                  />
                  <RHFDatePicker
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    disabled={!updateTrigger}
                  />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <RHFTextField
                    name="gender"
                    label="Gender"
                    inputType="dropDown"
                    dropDownData={genderData}
                    disabled={!updateTrigger}
                  />
                  <RHFTextField
                    name="phoneNumber"
                    label="Phone number"
                    type="number"
                    placeholder="09XX XXX XXXX"
                    disabled={!updateTrigger}
                  />
                </Stack>
                <TextField
                  label="Region"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={
                    regionData?.find((str) => str.label === userRegion)?.value
                  }
                  onChange={province}
                  disabled={!updateTrigger}
                >
                  <option key={0} value={0}>
                    {"Select Region"}
                  </option>
                  {regionData?.map((option, key) => (
                    <option key={key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Province"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={
                    provinceData?.find((str) => str.label === userProvince)
                      ?.value
                  }
                  onChange={city}
                  disabled={!updateTrigger}
                >
                  <option key={0} value={0}>
                    {"Select Province"}
                  </option>
                  {provinceData?.map((option, key) => (
                    <option key={key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="City"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={cityData?.find((str) => str.label === userCity)?.value}
                  onChange={barangay}
                  disabled={!updateTrigger}
                >
                  <option key={0} value={0}>
                    {"Select City"}
                  </option>
                  {cityData?.map((option, key) => (
                    <option key={key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Barangay"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={
                    barangayData?.find((str) => str.label === userBarangay)
                      ?.value
                  }
                  onChange={brgy}
                  disabled={!updateTrigger}
                >
                  <option key={0} value={0}>
                    {"Select Barangay"}
                  </option>
                  {barangayData?.map((option, key) => (
                    <option key={key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  placeholder="Street"
                  name="street"
                  value={userStreet}
                  onChange={(e) => dispatch(setUserStreet(e.target.value))}
                  disabled={!updateTrigger}
                />
                <TextField
                  placeholder="Zipcode"
                  name="zipcode"
                  value={userZipcode}
                  onChange={(e) => dispatch(setUserZipcode(e.target.value))}
                  disabled={!updateTrigger}
                />
              </Stack>
            </Stack>
          </>
        </FormProvider>
      </Container>
    </Page>
  );
}

export default ProfilePage;
