import React, { useState, useEffect } from "react";
// @mui
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import moment from "moment";
import { Button, Stack, TextField } from "@mui/material";
import _ from "lodash";
import {
  setUserRegion,
  setUserProvince,
  setUserCity,
  setUserBarangay,
  setUserStreet,
  setUserZipcode,
} from "../../../store/slice/AddressSlice";
import { useDispatch, useSelector } from "react-redux";
import userApi from "../../../lib/services/userApi";
import employmentApi from "../../../lib/services/employmentApi";
import trainingApi from "../../../lib/services/trainingApi";
import educationApi from "../../../lib/services/educationApi";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

export default function UserAddress({ handleClose }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const { addProfileAddress } = userApi;
  const { createEmployment } = employmentApi;
  const { createTraining } = trainingApi;
  const { createEducation } = educationApi;
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
  const { trainings } = useSelector((store) => store.training);
  const { education } = useSelector((store) => store.education);
  const { profileSetup, image } = useSelector((store) => store.profileSetup);
  const {
    currentOccupation,
    currentlyEmployed,
    type,
    stateOfReasons,
    lineOfBusiness,
    profession
  } = useSelector((store) => store.employment);

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
  console.log(profileSetup.dob);
  const onSubmit = async () => {
    setIsLoading(true);
    let employmentPayload = {};
    const formData = new FormData();
    formData.append("civil_status", profileSetup.civil_status);
    formData.append("dob", moment(profileSetup.dob).format("YYYY-MM-DD"));
    if(image.length > 0) {
      formData.append("image", image[0]?.file);
    } else {
      formData.append("image", '');
    }
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

    if (currentlyEmployed === "yes") {
      employmentPayload = {
        status: currentlyEmployed,
        type: type,
        present_occupation: currentOccupation,
        line_of_business: lineOfBusiness,
        profession: profession,
      };
    } else {
      employmentPayload = {
        status: currentlyEmployed,
        state_of_reasons: `[${stateOfReasons}]`,
      };
    }
    const trainingPayload = {
      data: trainings,
    };

    const educationPayload = {
      college: education.collegeSchool,
      college_address: education.collegeAddress,
      course: education.course,
      college_sy: `[${moment(education.collegeSyStart).format(
        "YYYY"
      )}, ${moment(education.collegeSyEnd).format("YYYY")}]`,
      high_school: education.highSchool,
      high_address: education.highAddress,
      high_sy: `[${moment(education.highSyStart).format("YYYY")}, ${moment(
        education.highSyEnd
      ).format("YYYY")}]`,
      elem_school: education.elemSchool,
      elem_address: education.elemAddress,
      elem_sy: `[${moment(education.elemSyStart).format("YYYY")}, ${moment(
        education.elemSyEnd
      ).format("YYYY")}]`,
    };

    try {
      await createEducation(educationPayload);
      await addProfileAddress(formData);
      await createEmployment(employmentPayload);
      await createTraining(trainingPayload);
      toast.success("Information successfully saved.");
      setIsLoading(false);
      handleClose();
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={2} sx={{ marginTop: 5 }}>
        <TextField
          placeholder="Region"
          label="Region"
          fullWidth
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={regionData?.find((str) => str.label === userRegion)?.value}
          onChange={province}
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
          placeholder="Province"
          label="Province"
          fullWidth
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={provinceData?.find((str) => str.label === userProvince)?.value}
          onChange={city}
        >
          {provinceData?.map((option, key) => (
            <option key={key} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          placeholder="City"
          label="City"
          fullWidth
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={cityData?.find((str) => str.label === userCity)?.value}
          onChange={barangay}
        >
          {cityData?.map((option, key) => (
            <option key={key} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          placeholder="Barangay"
          label="Barangay"
          fullWidth
          select
          SelectProps={{ native: true }}
          variant="outlined"
          value={barangayData?.find((str) => str.label === userBarangay)?.value}
          onChange={brgy}
        >
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
        />
        <TextField
          placeholder="Zipcode"
          name="zipcode"
          value={userZipcode}
          onChange={(e) => dispatch(setUserZipcode(e.target.value))}
        />
      </Stack>
      <LoadingButton
        onClick={onSubmit}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          alignSelf: "center",
          width: 200,
          position: "absolute",
          bottom: 20,
          right: 30,
        }}
        loading={isLoading}
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
    </>
  );
}
