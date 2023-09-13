import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      // eslint-disable-next-line no-undef
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),

  withScriptjs,
  withGoogleMap
)((properties) => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {/* {properties.currentLocation && (
      <Marker
        position={{ lat: properties.currentLocation.lat, lng: properties.currentLocation.lng }}
      />
    )} */}
  </GoogleMap>
));
export default MapComponent;
