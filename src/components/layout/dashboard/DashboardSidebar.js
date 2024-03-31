import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
  capitalize,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
// hooks
import useResponsive from "../../../lib/hooks/useResponsive";
// components
import Logo from "../../Logo";
import Scrollbar from "../../Scrollbar";
import NavSection from "../../NavSection";
// side navigation
import adminNav from "../../../lib/nav/adminNav";
import userNav from "../../../lib/nav/userNav";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: "#004C99",
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive("up", "lg");
  const userData = getLocalStorageItem("userData");
  const [navConfig, setNavConfig] = useState([]);
  const { profileImage } = useSelector((store) => store.profileSetup);
  useEffect(() => {
    switch (userData?.role) {
      case "admin":
        setNavConfig(adminNav);
        break;
      case "user":
        setNavConfig(userNav);
        break;
      default:
        break;
    }
  }, [userData?.role]);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
        backgroundColor: "#0080FF",
      }}
    >
      <Box
        sx={{ px: 2.5, py: 3, justifyContent: "center", alignItems: "center" }}
      >
        {/* <img
          alt="register"
          src="/static/laundry-shop.png"
          style={{
            height: 50,
            width: 50,
            marginBottom: 10,
          }}
        /> */}
      </Box>

      <Box sx={{ mb: 5, mx: 2.5, mt: -5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              justifyItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt="register"
              src={"/static/ustp_logo.png"}
              style={{
                height: 120,
                width: 120,
                marginBottom: 10,
                justifySelf: "center",
                alignSelf: "center",
                borderRadius: 150,
              }}
            />
          </div>

          <AccountStyle>
            {userData.image ? (
              <Avatar
                src={
                  userData.image
                    ? `${process.env.REACT_APP_API_LOCAL_URL}/storage/${userData.image}`
                    : "/static/ustp_logo.png"
                }
                alt="photoURL"
                sx={{ objectFit: "contain" }}
              />
            ) : (
              <Avatar sx={{ bgcolor: yellow[700] }} aria-label="recipe">
                {capitalize(userData?.first_name.charAt(0))}
              </Avatar>
            )}
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "white" }}>
                {userData?.first_name?.charAt(0)?.toUpperCase() +
                  userData?.first_name?.slice(1) +
                  " " +
                  userData?.last_name?.charAt(0).toUpperCase() +
                  userData?.last_name?.slice(1)}
              </Typography>
              {/* <Typography variant="body2" sx={{ color: "white" }}>
                Role -{" "}
                {userData?.role?.charAt(0)?.toUpperCase() +
                  userData?.role?.slice(1)}
              </Typography> */}
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
