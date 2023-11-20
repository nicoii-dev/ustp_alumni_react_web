import React, { useState } from "react";
import {
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Iconify from "../../Iconify";
import { RHFTextField } from "../../hook-form";
import employmentStatusList from "../../../lib/json-data/employmentStatus.json";
import {
  setType,
  setReasons,
  setOccupation,
  setStatus,
} from "../../../store/slice/EmploymentStatusSlice";

const EmploymentStatus = ({ activeStep, setActiveStep }) => {
  const { currentOccupation, currentlyEmployed, type, stateOfReasons } =
    useSelector((store) => store.employment);
  const dispatch = useDispatch();
  // const [employmentStatus, setEmploymentStatus] = useState(currentlyEmployed);
  // const [employmentType, setEmploymentType] = useState(type)
  // const [occupation, setUserOccupation] = useState(currentOccupation);
  // const [stateReasonsList, setStateReasonsList] = useState(stateOfReasons);
  console.log(stateOfReasons);
  const onEmploymentChanged = (event) => {
    dispatch(setStatus(event.target.value));
    dispatch(setOccupation(""));
    dispatch(setReasons([]));
    dispatch(setType(""));
  };

  const onOccupationChange = (e) => {
    dispatch(setOccupation(e.target.value));
  };

  const onEmploymentTypeChange = (e) => {
    dispatch(setType(e.target.value));
  };

  const stateReasonsHandler = (event) => {
    let reasonsArray = [...stateOfReasons];
    if (!stateOfReasons.includes(event.target.value)) {
      reasonsArray.push(event.target.value);
    } else {
      const index = reasonsArray.indexOf(event.target.value);
      if (index > -1) {
        // only splice array when item is found
        reasonsArray.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    dispatch(setReasons(reasonsArray));
  };
  console.log(stateOfReasons);
  const error = stateOfReasons.length < 1;

  const onNextHandler = () => {
    if (currentlyEmployed === "yes") {
      dispatch(setReasons([]));
    } else {
      dispatch(setOccupation(""));
      dispatch(setType(""));
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <>
      <IconButton
        style={{
          position: "absolute",
          left: 30,
          top: "50%",
          zIndex: 999,
        }}
        onClick={() => {
          setActiveStep(activeStep - 1);
        }}
      >
        <Iconify
          icon={"ic:round-arrow-back-ios"}
          sx={{
            width: 70,
            height: 70,
            color: "#2065d1",
            cursor: "pointer",
          }}
        />
      </IconButton>
      <Stack sx={{ marginTop: 5, gap: 1, paddingRight: 15, paddingLeft: 15 }}>
        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{ textAlign: "left" }}
          >
            Currently Employed?
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="yes"
            name="radio-buttons-group"
            value={currentlyEmployed}
            onChange={onEmploymentChanged}
          >
            <Box sx={{ display: "flex" }}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
              <FormControlLabel
                value="never"
                control={<Radio />}
                label="Never been Employed"
              />
            </Box>
          </RadioGroup>
        </FormControl>
        {currentlyEmployed === "yes" ? (
          <Stack sx={{ marginTop: 2, gap: 1 }}>
            <TextField
              fullWidth
              select
              SelectProps={{ native: true }}
              variant="outlined"
              value={type}
              onChange={onEmploymentTypeChange}
            >
              {employmentStatusList?.map((option, key) => (
                <option key={key} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <TextField
              value={currentOccupation}
              onChange={onOccupationChange}
              fullWidth
              error={currentOccupation.length < 1}
              helperText={"Occupation is required"}
              placeholder="Present Occupation"
              name="presentOccupation"
            />
          </Stack>
        ) : (
          <FormControl
            required
            error={error}
            component="fieldset"
            sx={{ m: 3 }}
            variant="standard"
          >
            <FormLabel component="legend" sx={{ textAlign: "left" }}>
              Please state reason(s) why you are not yet employed. You may check
              more than one answer.
            </FormLabel>
            <FormGroup>
              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={gilad}
                      onChange={stateReasonsHandler}
                      value="Advance or further study"
                      checked={stateOfReasons.includes(
                        "Advance or further study"
                      )}
                    />
                  }
                  label="Advance or further study"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={jason}
                      onChange={stateReasonsHandler}
                      value="Family concern and decided not to find a job"
                      checked={stateOfReasons.includes(
                        "Family concern and decided not to find a job"
                      )}
                    />
                  }
                  label="Family concern and decided not to find a job"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={antoine}
                      onChange={stateReasonsHandler}
                      value="Health-related reason(s)"
                      checked={stateOfReasons.includes(
                        "Health-related reason(s)"
                      )}
                    />
                  }
                  label="Health-related reason(s)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={gilad}
                      onChange={stateReasonsHandler}
                      value="Lack of work experience"
                      checked={stateOfReasons.includes(
                        "Lack of work experience"
                      )}
                    />
                  }
                  label="Lack of work experience"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={jason}
                      onChange={stateReasonsHandler}
                      value="No job opportunity"
                      checked={stateOfReasons.includes("No job opportunity")}
                    />
                  }
                  label="No job opportunity"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={antoine}
                      onChange={stateReasonsHandler}
                      value="Did not look for a job"
                      checked={stateOfReasons.includes(
                        "Did not look for a job"
                      )}
                    />
                  }
                  label="Did not look for a job"
                />
                {/* <FormControlLabel
                control={
                  <Checkbox
                    // checked={antoine}
                    onChange={stateReasonsHandler}
                    value="antoine"
                  />
                }
                label="Other reason(s), please specify"
              /> */}
              </Box>
            </FormGroup>

            <FormHelperText>Please select atleast 1 reason.</FormHelperText>
          </FormControl>
        )}
      </Stack>
      <IconButton
        style={{
          position: "absolute",
          right: 30,
          top: "50%",
        }}
        disabled={currentOccupation.length < 1 && stateOfReasons.length < 1}
        onClick={onNextHandler}
      >
        <Iconify
          icon={"ic:round-arrow-forward-ios"}
          sx={{
            width: 70,
            height: 70,
            color: "#2065d1",
            cursor: "pointer",
          }}
        />
      </IconButton>
    </>
  );
};

export default EmploymentStatus;
