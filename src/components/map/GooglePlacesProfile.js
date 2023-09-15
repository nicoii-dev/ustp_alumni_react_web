import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import _ from "lodash";
import { TextField, Autocomplete } from "@mui/material";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { setAddress } from "../../store/slice/AddressSlice";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

export default function GooglePlacesProfile() {
  const { profile } = useSelector((store) => store.profile);
  const [currentLocation, setCurrentLocation] = useState([]);
  const [ libraries ] = useState(['places']);
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map currentLocation={ !_.isEmpty(profile) ? JSON.parse(profile.location) : currentLocation } />;
}

function Map(_props) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);

  const onMapClick = async (e) => {
    setSelected(e.latLng)
    const results = await getGeocode( {latLng: e.latLng} )
    const { lat, lng } = await getLatLng(results[0]);
    const payload  = {
      street: results[0].address_components[0].long_name,
      barangay: '',
      formattedAddress: results[0].formatted_address,
      zipcode: '',
      location: {
          lat: lat,
          lng: lng
      },
    }
    await dispatch(setAddress(payload))
  };
  console.log(_props.currentLocation)
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>
      {_props.currentLocation ? 
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px", marginTop: 5 }}
        zoom={15}
        center={!_.isEmpty(selected) || !_.isNull(selected) ? selected : _props.currentLocation}
        mapContainerClassName="map-container"
        onClick={onMapClick}
        onLoad={map => {
            const bounds = new window.google.maps.LatLngBounds();
            map.fitBounds(bounds);
          }}
      >
        {<MarkerF position={!_.isEmpty(selected) || !_.isNull(selected) ? selected : _props.currentLocation} />}
      </GoogleMap>
      : <></>}
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const dispatch = useDispatch();
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      console.log(results[0])
      const { lat, lng } = await getLatLng(results[0]);

      const payload  = {
        street: '',
        barangay: '',
        formattedAddress: results[0].formatted_address,
        zipcode: '',
        location: {
            lat: lat,
            lng: lng
        },
      }
      await dispatch(setAddress(payload))

      setSelected({ lat, lng });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={
          status === "OK" && data.length > 0
            ? data?.map((option) => option?.description)
            : []
        }
        sx={{ width: '100%' }}
        // onSelect={(e) => {
        //   handleSelect(e.target.value);
        // }}
        onChange={(e) => {
          handleSelect(e.target.innerText);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search places"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            // placeholder="Search an address"
          />
        )}
      />
    </div>
  );
};
