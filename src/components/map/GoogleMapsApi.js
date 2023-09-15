import React, { useState, useRef, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import Iconify from "../Iconify";

function GoogleMapsApi(_props) {
  console.log(_props);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "500px", marginTop: 5 }}
      zoom={12}
      center={_props.coordinates}
      mapContainerClassName="map-container"
      // onLoad={(map) => {
      //   const bounds = new window.google.maps.LatLngBounds();
      //   map.fitBounds(bounds);
      // }}
    >
      {_props.coordinates && (
        <MarkerF
          position={_props.coordinates}
          icon={
            <Iconify icon="eva:menu-2-fill" />
            // <img
            //   alt="shop"
            //   src="/static/signboard.png"
            //   style={{
            //     height: 30,
            //     width: 30,
            //   }}
            //   height="30px"
            //   width="30px"
            // />
          }
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default GoogleMapsApi;
