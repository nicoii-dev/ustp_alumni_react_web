import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Link, Container, Typography, Box } from "@mui/material";
import Page from "../../../components/Page";
import GooglePlaces from "../../../components/map/GooglePlaces";
import ShopForm from "../../../components/pages/shop/ShopForm";

function CreateShop(_props) {
  const [currentLocation, setCurrentLocation] = useState([]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <Page title="Create Shop">
      <Container maxWidth="md">
        <Card sx={{ marginTop: 0 }}>
          <div style={{ marginTop: 15 }}>
            <GooglePlaces currentLocation={currentLocation} />
          </div>
          <div style={{ marginTop: 15 }}>
            <ShopForm handleClose={_props.handleClose}/>
          </div>
          {/* <GoogleMapsApi /> */}
          {/* <GoogleMap currentLocation={currentLocation} /> */}
          {/* <MapComponent /> */}
        </Card>
      </Container>
    </Page>
  );
}

export default CreateShop;
