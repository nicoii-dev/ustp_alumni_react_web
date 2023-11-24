import React, { useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// @mui
import { styled } from "@mui/material/styles";
import {
  Card,
  CircularProgress,
  Container,
  Typography,
  Box,
} from "@mui/material";
// hooks
import useResponsive from "../../lib/hooks/useResponsive";
// components
import Page from "../../components/Page";
import userApi from "../../lib/services/userApi";

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
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function EmailVerification() {
  const navigate = useNavigate();
  const { email, token } = useParams();
  const { verifyEmail } = userApi;

  useEffect(() => {
    (async () => {
      try {
        const response = await verifyEmail(token, {
          email: email,
        });
        setTimeout(() => {
          toast.success("Email verified");
          navigate("/login");
        }, 3000);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <Page title="Email Verification">
      <RootStyle>
        <Container maxWidth="sm">
          <Card sx={{ marginTop: 10 }}>
            <ContentStyle>
              <img
                alt="register"
                src="/static/ustp-logo.jpg"
                style={{
                  height: 200,
                  width: 200,
                  marginBottom: 10,
                  justifySelf: "center",
                  alignSelf: "center",
                  borderRadius: 150,
                }}
              />

              <Typography variant="h3" gutterBottom sx={{ mt: 5 }}>
                Verifying Email...
              </Typography>
              <CircularProgress sx={{ mt: 5 }} />
            </ContentStyle>
          </Card>
        </Container>
      </RootStyle>
    </Page>
  );
}
