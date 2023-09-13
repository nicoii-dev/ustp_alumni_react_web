import React, { Component, useEffect, useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

function CustomMap({ google, locations = [], currentLocation }) {

  const handleClick = (e) => {
    console.log(e)
  }
  return (
    <Map
      google={google}
      containerStyle={{
        width: "80%",
        height: "500px",
      }}
      style={{
        width: "80%",
        height: "500px",
        marginBottom: 20
      }}
      center={currentLocation}
      initialCenter={currentLocation}
      zoom={locations.length === 1 ? 18 : 13}
      disableDefaultUI={true}
      onClick={(e) => {handleClick(e)}}
    >
      {/* {locations.map((coords) => (
        <Marker position={coords} />
      ))} */}
      <Marker
        title={"The marker`s title will appear as a tooltip."}
        name={"SOMA"}
        position={{ lat: 37.778519, lng: -122.40564 }}
      />
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(CustomMap);
