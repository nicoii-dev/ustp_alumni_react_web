import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import Page from "../../components/Page";
import ProfileForm from "../../components/pages/profile/ProfileForm";
import GooglePlacesProfile from "../../components/map/GooglePlacesProfile";

function LabanderoProfilePage() {

  return (
    <Page title="Profile">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Profile Page
        </Typography>
        <div style={{ marginTop: 15, marginBottom: 15 }}>
          <GooglePlacesProfile />
        </div>
        <ProfileForm />
      </Container>
    </Page>
  );
}

export default LabanderoProfilePage;
