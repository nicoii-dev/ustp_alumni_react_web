import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
// form
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, IconButton, InputAdornment, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../Iconify";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { RegistrationSchema } from "../../../../lib/yup-schema/RegistrationSchema";
import { setLocalStorageItem } from "../../../../lib/util/setLocalStorage";
// api
import userApi from "../../../../lib/services/userApi";

// ----------------------------------------------------------------------
const genderData = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function RegisterForm(_props) {
  const navigate = useNavigate();
  const { register } = userApi;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValues = {
    firstName: "",
    lastName: "",
    gender: "male",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegistrationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: registerUser, isLoading: loginUserLoading } = useMutation(
    (payload) => register(payload),
    {
      onSuccess: (data) => {
        setLocalStorageItem("userToken", data.data.token, 9999);
        setLocalStorageItem("userData", data.data.user, 9999);
        navigate(`/login`);
        toast.success('Registration is successfull. Please check your email to verify.');
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      gender: data.gender,
      phone_number: data.phoneNumber,
      role: _props.accountType,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword
    }
    registerUser(payload);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField
            name="type"
            label="Account type"
            value={_props.accountLabel}
            disabled
          />
          <Button
            onClick={() => {
              _props.openDialog();
            }}
          >
            Update
          </Button>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField
            name="gender"
            label="Gender"
            inputType="dropDown"
            dropDownData={genderData}
          />
          <RHFTextField
            name="phoneNumber"
            label="Phone number"
            type="number"
            placeholder="09XX XXX XXXX"
          />
        </Stack>
        <RHFTextField name="email" label="Email address" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="confirmPassword"
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Iconify
                    icon={
                      showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loginUserLoading}
        >
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
