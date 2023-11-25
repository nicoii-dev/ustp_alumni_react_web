import { useEffect, useState } from "react";
import * as yup from "yup";
import DialogModal, { useDialog } from "../../DialogModal";
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
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import { FormProvider, RHFTextField, RHFDatePicker } from "../../hook-form";
import UserAddress from "./UserAddress";
import Iconify from "../../Iconify";
import userApi from "../../../lib/services/userApi";
import EmploymentStatus from "./EmploymentStatus";
import employmentApi from "../../../lib/services/employmentApi";
import Trainings from "./Tranings";
import { setProfileSetup } from "../../../store/slice/SetupProfileSlice";

// ----------------------------------------------------------------------

export default function SetupProfile(_props) {
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const { logout } = userApi;
  const { getEmployment } = employmentApi;
  const userData = getLocalStorageItem("userData");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const steps = ["Personal Info", "Employment Status", "Trainings", "Address"];
  const [activeStep, setActiveStep] = useState(0);
  const { trainings } = useSelector((store) => store.training);

  const defaultValues = {
    civil_status: "",
    dob: "",
  };

  const profileSchema = yup
    .object({
      civil_status: yup.string().required("Civil Status is Required"),
      dob: yup.string().required("Date of Birth is Required"),
    })
    .required();

  const methods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {
    data: employmentData,
    status: employmentStatus,
    isLoading: employmentIsLoading,
  } = useQuery(["view-profile"], () => getEmployment(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (employmentStatus === "success") {
      if (_.isEmpty(employmentData?.data) && userData.role === 'user') openDialog(true);
    }
  }, [employmentData, employmentStatus]);

  const { mutate: logOut, isLoading: logOutLoading } = useMutation(
    () => logout(),
    {
      onSettled: () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        queryClient.clear();
        navigate("/login", { replace: true });
      },
    }
  );

  //     const { mutate: update, isLoading: updateProfileLoading } = useMutation(
  //     (payload) => updateProfile(payload),
  //     {
  //       onSuccess: (data) => {
  //         queryClient.invalidateQueries(["get-all-shop-services"]);
  //         toast.success("Laundry Service successfully updated.");
  //       },
  //       onError: (error) => {
  //         toast.error(error.response.data.message);
  //       },
  //     }
  //   );

  const onUpdate = async (data) => {
    console.log(data)
    dispatch(setProfileSetup(data))
    setActiveStep(activeStep + 1);
  };

  return (
    <DialogModal
      open={open}
      handleClose={() => {
        Swal.fire({
          title: "Are you sure you want to logout?",
          // text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "No",
          confirmButtonText: "Yes, logout!",
        }).then((result) => {
          if (result.isConfirmed) {
            logOut();
          }
        });
      }}
      title={"Welcome USTP Alumnus App"}
      subtitle={
        "To continue using the app. Please provide the neccessary information."
      }
      styles={{
        div: { textAlign: "center", height: "90vh" },
        title: { fontSize: 32 },
        subtitle: { fontSize: 16 },
      }}
      width={"md"}
    >
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
      <Stack spacing={0}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onUpdate)}>
          <Box marginTop={5}>
            {activeStep === 0 && (
              <>
                <Stack
                  sx={{
                    marginTop: 5,
                    gap: 1,
                    paddingRight: 15,
                    paddingLeft: 15,
                  }}
                >
                  <RHFTextField name="civil_status" label="Civil Status" />
                  <RHFDatePicker name="dob" label="Date of Birth" type="date" />
                </Stack>
                <IconButton
                  style={{
                    position: "absolute",
                    right: 30,
                    top: "50%",
                  }}
                  type="submit"
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
            )}
          </Box>
        </FormProvider>
        {activeStep === 1 && (
          <>
            <EmploymentStatus
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </>
        )}

        {activeStep === 2 && (
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
            <Stack
              sx={{ marginTop: 5, gap: 1, paddingRight: 15, paddingLeft: 15 }}
            >
              <Trainings />
            </Stack>
            <IconButton
              style={{
                position: "absolute",
                right: 30,
                top: "50%",
              }}
              onClick={() => {
                if (trainings.length < 1) {
                  toast.error("Please submit at least 1 training");
                  return;
                }
                setActiveStep(activeStep + 1);
              }}
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
        )}

        {activeStep === 3 && (
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
            <Stack sx={{ gap: 1, paddingRight: 15, paddingLeft: 15 }}>
              <UserAddress handleClose={handleClose} />
            </Stack>
          </>
        )}
      </Stack>
    </DialogModal>
  );
}
