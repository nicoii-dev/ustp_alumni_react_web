import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
} from "@mui/material";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
// hooks
import useResponsive from "../../../lib/hooks/useResponsive";
// components
import Logo from "../../Logo";
import Scrollbar from "../../Scrollbar";
import NavSection from "../../NavSection";
// side navigation
import adminNav from "../../../lib/nav/adminNav";
import shopNav from "../../../lib/nav/shopNav";
import labanderoNav from "../../../lib/nav/labanderoNav";
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
  backgroundColor: theme.palette.grey[500_12],
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
  useEffect(() => {
    switch (userData?.role) {
      case "admin":
        setNavConfig(adminNav);
        break;
      case "user":
        setNavConfig(userNav);
        break;
      case "labandero":
        setNavConfig(labanderoNav);
        break;
      case "shop":
        setNavConfig(shopNav);
        break;
      default:
        break;
    }
  }, []);

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
        backgroundColor: "white",
      }}
    >
      <Box sx={{ px: 2.5, py: 3, justifyContent: 'center', alignItems: 'center'}}>
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

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar
              src={
                "https://www.rd.com/wp-content/uploads/2021/09/GettyImages-1181334518-MLedit.jpg"
              }
              alt="photoURL"
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {userData.first_name.charAt(0).toUpperCase() +
                  userData.first_name.slice(1) +
                  " " +
                  userData.last_name.charAt(0).toUpperCase() +
                  userData.last_name.slice(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </Typography>
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
