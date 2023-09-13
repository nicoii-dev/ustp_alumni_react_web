import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import _ from "lodash";
// form
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, IconButton, InputAdornment, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { ServiceSchema } from "../../../../lib/yup-schema/serviceSchema";
// api
import servicesApi from "../../../../lib/services/servicesApi";
// ----------------------------------------------------------------------

const servicesList = [
  { value: "Pickup laundry services", label: "Pickup laundry services" },
  {
    value: "Commercial laundry services",
    label: "Commercial laundry services",
  },
  { value: "Dry cleaning services", label: "Dry cleaning services" },
  {
    value: "Fluff and fold laundry services",
    label: "Fluff and fold laundry services",
  },
  { value: "Laundromat self-service", label: "Laundromat self-service" },
];

export default function ServicesForm(_props) {
  const queryClient = useQueryClient();
  const { shop } = useSelector((store) => store.shop);
  const { service } = useSelector((store) => store.service);
  const { createServices, viewServices, updateServices, deleteServices } =
    servicesApi;

  const defaultValues = {
    serviceName: "Pickup laundry services",
    price: "",
  };

  const methods = useForm({
    resolver: yupResolver(ServiceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue
  } = methods;

  useEffect(() => {
    setValue('serviceName', _.isEmpty(service) ? "Pickup laundry services" : service?.service_name)
    setValue('price', _.isEmpty(service) ? "" : parseInt(service?.price))
  },[service, setValue])

  const { mutate: create, isLoading: createServiceLoading } = useMutation(
    (payload) => createServices(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-shop-services"]);
        toast.success("Laundry Service successfully created.");
        _props.handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const { mutate: update, isLoading: updateServiceLoading } = useMutation(
    (payload) => updateServices(service?.id, payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-shop-services"]);
        toast.success("Laundry Service successfully updated.");
        _props.handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onSubmit = async (data) => {
    const payload = {
      shop_id: shop.id,
      service_name: data.serviceName,
      price: data.price,
    };
    create(payload);
  };

  const onUpdate = async (data) => {
    const payload = {
      shop_id: shop.id,
      service_name: data.serviceName,
      price: data.price,
    };
    update(payload);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(_.isEmpty(service) ? onSubmit : onUpdate)}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <RHFTextField
          name="serviceName"
          label="Service"
          inputType="dropDown"
          dropDownData={servicesList}
        />
        <RHFTextField name="price" label="Price (₱)" />

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
            loading={_.isEmpty(service) ? createServiceLoading : updateServiceLoading}
            sx={{ marginRight: 2 }}
          >
            {!_.isEmpty(service) ? 'Update' : 'Create' }
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
