import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Page from "../../../components/Page";
import { Container, Typography, Grid, Box, Button } from "@mui/material";
import AppWidgetSummary from "../../../components/sections/@dashboard/app/AppWidgetSummary";
import DialogModal, { useDialog } from "../../../components/DialogModal";
import CreateShop from "./CreateShop";
import Iconify from "../../../components/Iconify";
import shopApi from "../../../lib/services/shopApi";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import Services from "./Services";
import GoogleMapsApi from "../../../components/map/GoogleMapsApi";
import { setShop } from "../../../store/slice/ShopSlice";

const colors = ["primary", "secondary", "info", "success", "warning"];

function ShopDashboardPage() {
  const dispatch = useDispatch();
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const { shop } = useSelector((store) => store.shop);
  const { getUserShops } = shopApi;
  const userData = getLocalStorageItem("userData");
  const [selectedShop, setSelectedShop] = useState("");

  const {
    data: shopData,
    status: shopStatus,
    isFetching: shopIsFetching,
  } = useQuery(["get-all-user-shops"], () => getUserShops(userData.id), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
  return (
    <Page title="Shops">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, {userData.first_name.charAt(0).toUpperCase() + userData.first_name.slice(1)}
        </Typography>

        <Box
          sx={{
            width: "95%",
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
            sx={{ float: "right" }}
          >
            <Iconify
              icon="mdi:shop-plus"
              width={20}
              height={20}
              sx={{ mr: 1 }}
            />
            New Shop
          </Button>
        </Box>

        <Grid container spacing={3}>
          {shopData?.data?.map((data, index) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={2.3}
                key={index}
              >
                <AppWidgetSummary
                  title={
                    data?.shop_name.charAt(0).toUpperCase() +
                    data?.shop_name.slice(1)
                  }
                  total={714000}
                  icon={"ant-design:android-filled"}
                  color={colors[index]}
                  data={data}
                  // onClick={() => {
                  //   dispatch(setShop(data));
                  //   setSelectedShop(data);
                  // }}
                />
              </Grid>
            );
          })}
        </Grid>
        {shop.shop_name !== undefined ? (
          <Grid container sx={{ mt: 5 }} spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
              <Services  />
            </Grid>
            <Grid item xs={12} md={6} lg={9}>
              <GoogleMapsApi coordinates={JSON.parse(shop?.location)} />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="subtitle1" sx={{ mt: 10 }}>
            Select shop to view shop details
          </Typography>
        )}
      </Container>

      <DialogModal
        {...dialogProps}
        title={"Creating new Laundry Shop"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25 },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="md"
      >
        <CreateShop handleClose={handleClose} />
      </DialogModal>
    </Page>
  );
}

export default ShopDashboardPage;
