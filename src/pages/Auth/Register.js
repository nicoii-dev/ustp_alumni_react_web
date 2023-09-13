import { Link as RouterLink } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import {
  Card,
  Link,
  Container,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Grid
} from "@mui/material";
import Iconify from "../../components/Iconify";
// hooks
import useResponsive from "../../lib/hooks/useResponsive";
// components
import Page from "../../components/Page";
import DialogModal, { useDialog } from "../../components/DialogModal";
// sections
import RegisterForm from "../../components/sections/auth/register/RegisterForm";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(-10, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

const userType = [
  {
    value: "user",
    label: "User",
    icon: "mdi:user-circle-outline",
  },
  {
    value: "shop",
    label: "Laundry Shop",
    icon: "mdi:shop-location-outline",
  },
  {
    value: "labandero",
    label: "Labandero/Labandera",
    icon: "ri:map-pin-user-line",
  },
];

export default function Register() {
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");
  const [value, setValue] = useState("user");
  const [label, setLabel] = useState("User");
  const [open, openDialog, dialogProps, setOpen] = useDialog();

  useEffect(() => {
    openDialog();
  }, []);

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setLabel(event.nativeEvent.target.labels[0].innerText);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(value);
    setOpen(!open);
  };

  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle></HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Manage your laundry more effectively with Laundry Service Locator
            </Typography>
            <img
              alt="register"
              src="/static/laundry-shop.png"
              style={{ height: 300, width: 300, alignSelf: "center" }}
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Get started absolutely free.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}></Typography>

            {/* <AuthSocial /> */}

            <RegisterForm
              accountType={value}
              accountLabel={label}
              openDialog={openDialog}
            />

            {smUp && (
              <Typography variant="body2" sx={{ mt: 3, alignSelf: "end" }}>
                Already have an account? {""}
                <Link variant="subtitle2" component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            )}

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
                Already have an account?{" "}
                <Link variant="subtitle2" to="/login" component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>

      <DialogModal
        {...dialogProps}
        title={"Register as:"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25 },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        <form onSubmit={handleSubmit}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="userType"
              name="radio-buttons-group"
              value={value}
              onChange={handleRadioChange}
            >
              {userType.map((type, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={type.value}
                    control={<Radio />}
                    label={
                      <Grid container >
                        <Typography sx={{ fontSize: 18, fontWeight: "bold", color: value === type.value ? "#2065D1" : null }}>
                          {type.label}
                        </Typography>
                        <Iconify
                          icon={type.icon}
                          sx={{
                            ml: 0.5,
                            width: 25,
                            height: 25,
                            color: value === type.value ? "#2065D1" : null,
                          }}
                        />
                      </Grid>
                    }
                  />
                );
              })}
            </RadioGroup>
            <Button
              type="submit"
              variant="contained"
              sx={{ alignSelf: "end", marginTop: 5 }}
            >
              Save
            </Button>
          </FormControl>
        </form>
      </DialogModal>
    </Page>
  );
}
