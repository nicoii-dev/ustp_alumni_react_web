import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { useGeolocated } from "react-geolocated";
// form
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, IconButton, InputAdornment, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { ShopRegistrationSchema } from "../../../lib/yup-schema/ShopRegistrationSchema";
// api
import shopApi from "../../../lib/services/shopApi";
import { useDialog } from "../../DialogModal";
import GooglePlaces from "../../map/GooglePlaces";
import { setShop } from "../../../store/slice/ShopSlice";
// ----------------------------------------------------------------------

export default function ShopUpdateForm(_props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { updateShop } = shopApi;
  const { address } = useSelector((store) => store.address);
  const { shop } = useSelector((store) => store.shop);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  const defaultValues = {
    shopName: shop?.shop_name,
    buildingNumber: shop?.building_number || "",
    barangay: shop?.barangay,
    street: shop?.street,
    formattedAddress: shop?.formatted_address,
    zipcode: shop?.zipcode,
    lat: JSON.parse(shop?.location).lat,
    lng: JSON.parse(shop?.location).lng,
  };

  const methods = useForm({
    resolver: yupResolver(ShopRegistrationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    setValue("street", address?.street);
    setValue("formattedAddress", address?.formattedAddress);
    setValue("lat", address?.location?.lat);
    setValue("lng", address?.location?.lng);
  }, [address]);

  useEffect(() => {
    setValue('street', shop?.street)
    setValue('formattedAddress', shop?.formatted_address)
    setValue("lat", JSON.parse(shop?.location).lat);
    setValue("lng", JSON.parse(shop?.location).lng);
  },[setValue, shop])

  const { mutate: update, isLoading: updateShopLoading } = useMutation(
    (payload) => updateShop(shop?.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-user-shops"]);
        toast.success("Laundry Service successfully updated.");
        dispatch(setShop(data.data.data));
        _props.handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      shop_name: data.shopName,
      building_number: data.buildingNumber,
      street: data.street,
      barangay: data.barangay,
      zipcode: data.zipcode,
      formatted_address: data.formattedAddress,
      // city: "",
      // province: "",
      location: JSON.stringify({
        lat: data.lat,
        lng: data.lng,
      }),
    };
    update(payload);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <GooglePlaces />
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="shopName" label="Shop name" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="buildingNumber" label="Building number" />
          <RHFTextField name="street" label="Street" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="barangay" label="Barangay" />
          <RHFTextField name="zipcode" label="Zipcode" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}></Stack>
        <RHFTextField
          name="formattedAddress"
          label="Formatted address"
          disabled
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="lat" label="Latitude" disabled />
          <RHFTextField name="lng" label="Longitude" disabled />
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            width: "50%",
            alignContent: "end",
            alignSelf: "end",
            padding: 2,
          }}
          spacing={2}
        >
          <Button
            variant="outlined"
            color="error"
            sx={{ width: "50%" }}
            onClick={() => {
              _props.handleClose();
            }}
          >
            Close
          </Button>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={updateShopLoading}
            sx={{ marginRight: 2 }}
          >
            Update
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
