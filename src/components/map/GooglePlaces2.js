import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import _ from "lodash";
import {
  TextField,
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import Iconify from "../Iconify";
import { setAddress } from "../../store/slice/AddressSlice";
import DialogModal, { useDialog } from "../DialogModal";

export default function GooglePlaces2() {
  const [currentLocation, setCurrentLocation] = useState([
    { lat: 8.228021, lng: 124.245242 },
  ]);
  const [libraries] = useState(["places"]);
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
  return <Map currentLocation={currentLocation} />;
}

function Map(_props) {
  const dispatch = useDispatch();
  const { allShops } = useSelector((store) => store.allShops);
  const { include, allLabandero } = useSelector((store) => store.profile);
  const [selected, setSelected] = useState(null);
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();

  const onMapClick = async (e) => {
    setSelected(e.latLng);
    const results = await getGeocode({ latLng: e.latLng });
    const { lat, lng } = await getLatLng(results[0]);
    const payload = {
      street: results[0].address_components[0].long_name,
      barangay: "",
      formattedAddress: results[0].formatted_address,
      zipcode: "",
      location: {
        lat: lat,
        lng: lng,
      },
    };
    await dispatch(setAddress(payload));
  };
  const onLoad = (infoWindow) => {
    // console.log("infoWindow: ", infoWindow);
  };

  return (
    <>
      <div className="places-container">
        {/* <PlacesAutocomplete setSelected={setSelected} /> */}
        <Box
          sx={{
            width: "100%",
            mt: 5,
            justifyContent: "end",
            alignContent: "end",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              openDialog();
            }}
            sx={{ float: "left", mb: 2 }}
          >
            <Iconify
              icon="material-symbols:location-on"
              width={20}
              height={20}
              sx={{ mr: 1 }}
            />
            Set Place
          </Button>
        </Box>
      </div>
      <DialogModal
        {...dialogProps}
        title={"Search your area"}
        styles={{
          div: { textAlign: "center", height: 400 },
          title: { fontSize: 25 },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        <Box sx={{ mt: 2 }}>
          <PlacesAutocomplete setSelected={setSelected} />
        </Box>
        <Button
          variant="contained"
          style={{ position: "absolute", bottom: 15, right: 15 }}
          onClick={() => {
            handleClose();
          }}
        >
          Close
        </Button>
      </DialogModal>
      {_props.currentLocation ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "600px", marginTop: 5 }}
          zoom={7}
          center={
            !_.isEmpty(selected) || !_.isNull(selected)
              ? selected
              : _props.currentLocation
          }
          mapContainerClassName="map-container"
          onClick={onMapClick}
          onLoad={(map) => {
            const bounds = new window.google.maps.LatLngBounds();
            map.fitBounds(bounds);
          }}
        >
          {allShops.map((data, index) => {
            return (
              <MarkerF
                key={index}
                position={JSON.parse(data.shop.location)}
                icon={{
                  url: "/static/laundry-shop2.png",
                  scaledSize: new window.google.maps.Size(40, 40), // scaled size
                  origin: new window.google.maps.Point(0, 0), // origin
                  anchor: new window.google.maps.Point(0, 0), // anchor
                }}
              >
                <InfoWindowF
                  onLoad={onLoad}
                  position={JSON.parse(data.shop.location)}
                >
                  <div
                    style={{
                      background: `white`,
                      border: `1px solid #ccc`,
                      padding: 10,
                    }}
                  >
                    <h3>
                      {data.shop.shop_name.charAt(0).toUpperCase() +
                        data.shop.shop_name.slice(1)}
                    </h3>
                    <h4>{data.service_name}</h4>
                    <h4>{`₱${data.price}`}</h4>
                  </div>
                </InfoWindowF>
              </MarkerF>
            );
          })}
          {include &&
            allLabandero.map((data, index) => {
              if (!_.isUndefined(data.profile) && !_.isNull(data.profile)) {
                return (
                  <MarkerF
                    key={index}
                    position={JSON.parse(data.profile.location)}
                    icon={{
                      url: "/static/staff.png",
                      scaledSize: new window.google.maps.Size(40, 40), // scaled size
                      origin: new window.google.maps.Point(0, 0), // origin
                      anchor: new window.google.maps.Point(0, 0), // anchor
                    }}
                  >
                    <InfoWindowF
                      onLoad={onLoad}
                      position={JSON.parse(data.profile.location)}
                    >
                      <div
                        style={{
                          background: `white`,
                          border: `1px solid #ccc`,
                          padding: 10,
                        }}
                      >
                        <h3>
                          {data.first_name.charAt(0).toUpperCase() +
                            data.first_name.slice(1)}
                        </h3>
                        <h4>{data.phone_number}</h4>
                        <h4>
                          {data.role.charAt(0).toUpperCase() +
                            data.role.slice(1)}
                        </h4>
                      </div>
                    </InfoWindowF>
                  </MarkerF>
                );
              }
            })}
        </GoogleMap>
      ) : (
        <></>
      )}
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
      console.log(results[0]);
      const { lat, lng } = await getLatLng(results[0]);

      const payload = {
        street: "",
        barangay: "",
        formattedAddress: results[0].formatted_address,
        zipcode: "",
        location: {
          lat: lat,
          lng: lng,
        },
      };
      await dispatch(setAddress(payload));

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
        sx={{ width: "100%" }}
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
