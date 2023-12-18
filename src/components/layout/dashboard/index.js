import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import SetupProfile from '../../pages/profile/SetupProfile';
import { setProfileImage } from '../../../store/slice/SetupProfileSlice';
import userApi from '../../../lib/services/userApi';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { getProfile, updateProfile } = userApi;

  const { data: profileData, status: profileStatus } = useQuery(
    ["get-user-profile"],
    () => getProfile(),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );
  useEffect(() => {
    if(profileStatus === 'success') {
      dispatch(setProfileImage(profileData?.data?.image));
    }

  }, [dispatch, profileData?.data?.image, profileStatus])

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <SetupProfile />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
