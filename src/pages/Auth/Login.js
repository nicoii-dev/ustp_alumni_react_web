import { Link as RouterLink } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Card, Link, Container, Typography, Box } from "@mui/material";
// hooks
import useResponsive from "../../lib/hooks/useResponsive";
// components
import Page from "../../components/Page";
import Logo from "../../components/Logo";
// sections
import LoginForm from "../../components/sections/auth/login/LoginForm";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "50vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  return (
    <Page title="Login">
      <RootStyle>
        <Container maxWidth="sm">
          <Card sx={{ marginTop: 10 }}>
            <ContentStyle>
              <Box
                sx={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  border: 3,
                  borderColor: "gray",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                <img
                  alt="register"
                  src="/static/laundry-shop.png"
                  style={{ height: 100, width: 100, marginBottom: 10, justifySelf: 'center', alignSelf: 'center' }}
                />
              </Box>

              <Typography variant="h5" gutterBottom>
                Welcome to
              </Typography>
              <Typography variant="h3" gutterBottom>
                Laundry Service Locator
              </Typography>

              <Typography sx={{ color: "text.secondary", mb: 5 }}>
                Enter your credentials below.
              </Typography>

              {/* <AuthSocial /> */}

              <LoginForm />

              {smUp && (
                <Typography variant="body2" align="right" sx={{ mt: 3 }}>
                  Don’t have an account?{" "}
                  <Link
                    variant="subtitle2"
                    component={RouterLink}
                    to="/register"
                  >
                    Get started
                  </Link>
                </Typography>
              )}
            </ContentStyle>
          </Card>
        </Container>
      </RootStyle>
    </Page>
  );
}
