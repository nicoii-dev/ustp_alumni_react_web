import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../Iconify';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { setLocalStorageItem } from '../../../../lib/util/setLocalStorage';
import { LoginSchema } from '../../../../lib/yup-schema/LoginSchema';
// api
import userApi from '../../../../lib/services/userApi';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = userApi;

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: loginUser, isLoading: loginUserLoading } = useMutation((payload) => login(payload), {
    onSuccess: (data) => {
      setLocalStorageItem('userToken', data.data.token, 9999);
      setLocalStorageItem('userData', data.data.user, 9999);
      navigate(`/`);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = async (data) => {
    // loginUser(data)
    navigate('/dashboard')
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
        {/* <RHFCheckbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loginUserLoading} sx={{marginTop: 5}}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
