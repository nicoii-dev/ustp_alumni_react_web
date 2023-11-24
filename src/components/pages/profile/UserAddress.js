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
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export default function UserAddress({handleClose}) {
  const dispatch = useDispatch();
  const {addProfileAddress} = userApi;
  const {createEmployment} = employmentApi;
  const {createTraining} = trainingApi
  const [regionData, setRegion] = useState([]);
  const [provinceData, setProvince] = useState([]);
  const [cityData, setCity] = useState([]);
  const [barangayData, setBarangay] = useState([]);

  const {
    userRegion,
    userProvince,
    userCity,
    userBarangay,
    userStreet,
    userZipcode,
  } = useSelector((store) => store.address);
  const { trainings } = useSelector((store) => store.training);
  const { profileSetup } = useSelector((store) => store.profileSetup);
  const { currentOccupation, currentlyEmployed, type, stateOfReasons, lineOfBusiness } =
  useSelector((store) => store.employment);

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
    dispatch(setUserBarangay(e.target.selectedOptions[0].text));
  };

  useEffect(() => {
    region();
  }, []);

  const onSubmit = async () => {
    let employmentPayload = {}
    const profilePayload = {
      civil_status: profileSetup.civil_status,
      dob: moment(profileSetup.dob).format("YYYY-MM-DD"),
      street: userStreet,
      barangay: userBarangay,
      city: userCity,
      province: userProvince,
      region: userRegion,
      zipcode: userZipcode
    }
    if(currentlyEmployed === "yes") {
      employmentPayload = {
        status: currentlyEmployed,
        type: type,
        present_occupation: currentOccupation,
        line_of_business: lineOfBusiness
      }
    } else {
      employmentPayload = {
        status: currentlyEmployed,
        state_of_reasons: `[${stateOfReasons}]`,
      }
    }
    const trainingPayload = {
      data: trainings
    }

    console.log(employmentPayload)
    console.log(trainingPayload)
    console.log(profilePayload)
    try {
      await addProfileAddress(profilePayload)
      await createEmployment(employmentPayload)
      await createTraining(trainingPayload)
      toast.success("Information successfully saved.");
      handleClose()
    } catch (error) {
      toast.error("Something went wrong");
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
      <Button
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
      </Button>
    </>
  );
}
