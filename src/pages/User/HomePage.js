import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Stack,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import GooglePlaces2 from "../../components/map/GooglePlaces2";
import { LoadingButton } from "@mui/lab";
import servicesList from "../../lib/json-data/service.json";
// redux
import { setAllShop } from "../../store/slice/AllShopsSlice";
import { setInclude, setAllLabandero } from "../../store/slice/LabanderoSlice";
// api
import shopApi from "../../lib/services/shopApi";
import labanderoApi from "../../lib/services/labanderoApi";


function HomePage() {
  const { getAllServices, searchShops, } = shopApi;
  const { getAllLabandero } = labanderoApi;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [serviceChecked, setServiceChecked] = useState(false);
  const [priceChecked, setPriceChecked] = useState(false);
  const [labanderoChecked, setLabanderoChecked] = useState(false);
  const [service, setService] = useState("Pickup laundry services");
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);

  // const [service, setService] = React.useState("");

  const {
    data: shopsData,
    status: shopsStatus,
    isFetching: shopsIsFetching,
  } = useQuery(["get-all-search-services"], () => getAllServices(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (shopsStatus === "success") {
      dispatch(setAllShop(shopsData?.data.services));
    }
  }, [dispatch, shopsData, shopsStatus, shopsIsFetching]);

  const {
    data: labanderoData,
    status: labanderoStatus,
    isFetching: labanderoIsFetching,
  } = useQuery(["get-all-labandero"], () => getAllLabandero(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (labanderoStatus === "success") {
      dispatch(setAllLabandero(labanderoData?.data.labandero));
    }
  }, [dispatch, labanderoData?.data.labandero, labanderoStatus])

  const { mutate: Search, isLoading: searchLoading } = useMutation(
    (payload) => searchShops(payload),
    {
      onSuccess: (data) => {
        console.log(data.data.services);
        dispatch(setAllShop(data.data.services));
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onServiceChange = (event) => {
    setService(event.target.value);
  };

  const searchHandler = () => {
    let payload = {};
    if (serviceChecked && priceChecked) {
      if (parseFloat(minAmount) > parseFloat(maxAmount)) {
        toast.error("Invalid price range.");
      } else {
        payload = {
          service_name: service,
          price: JSON.stringify({ minPrice: minAmount, maxPrice: maxAmount }),
        };
        Search(payload);
      }
      return;
    }
    if (serviceChecked && !priceChecked) {
      payload = {
        service_name: service,
      };
      Search(payload);
      return;
    }
    if (!serviceChecked && priceChecked) {
      if (parseFloat(minAmount) > parseFloat(maxAmount)) {
        toast.error("Invalid price range.");
      } else {
        payload = {
          price: JSON.stringify({ minPrice: minAmount, maxPrice: maxAmount }),
        };
        Search(payload);
      }
      return;
    }
    if (!serviceChecked && !priceChecked) {
      toast.error("No search filter selected");
    }
  };

  return (
    <Page title="Home">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <Box sx={{ mt: 0 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={serviceChecked}
                onChange={(e) => {
                  setServiceChecked(e.target.checked);
                }}
              />
            }
            label={
              <FormControl size="small">
                <InputLabel id="demo-simple-select-label">Services</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={service}
                  label="Services"
                  onChange={onServiceChange}
                >
                  {servicesList.map((data, index) => {
                    return (
                      <MenuItem key={index} value={data.value}>
                        {data.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={priceChecked}
                onChange={(e) => {
                  setPriceChecked(e.target.checked);
                }}
              />
            }
            label={
              <>
                <FormControl size="small" sx={{ width: 150 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Min Amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">₱</InputAdornment>
                    }
                    type="number"
                    label="Min Amount"
                    placeholder="0"
                    onChange={(e) => setMinAmount(e.target.value)}
                  />
                </FormControl>
                <FormControl size="small" sx={{ width: 150, ml: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Min Amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">₱</InputAdornment>
                    }
                    type="number"
                    label="Max Amount"
                    placeholder="0"
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </FormControl>
              </>
            }
          />
          <LoadingButton
            variant="contained"
            sx={{ float: "right" }}
            loading={searchLoading}
            onClick={searchHandler}
          >
            <Iconify
              icon="eva:search-fill"
              width={20}
              height={20}
              sx={{ mr: 1 }}
            />
            Search
          </LoadingButton>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={labanderoChecked}
                  onChange={(e) => {
                    setLabanderoChecked(e.target.checked);
                    dispatch(setInclude(e.target.checked))
                  }}
                />
              }
              label={"Include Labandero/Labandera"}
            />
          </Stack>

          <GooglePlaces2 />
        </Box>
      </Container>
    </Page>
  );
}

export default HomePage;
