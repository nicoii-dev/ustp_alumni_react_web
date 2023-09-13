import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Page from "../../components/Page";
import { Container, Typography, Grid, Box, Button } from "@mui/material";
import AppWidgetAdmin from "../../components/sections/@dashboard/app/AppWidgetAdmin";

import Iconify from "../../components/Iconify";

import { getLocalStorageItem } from "../../lib/util/getLocalStorage";
import dashboardApi from "../../lib/services/dashboardApi";
import AdminChart from "../../components/graph/AdminChart";

function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { getDashboard } = dashboardApi;
  const userData = getLocalStorageItem("userData");
  const [userGraphData, setUserGraphData] = useState([]);

  const {
    data: dashboardData,
    status: dashboardStatus,
    isFetching: dashboardIsFetching,
  } = useQuery(["get-dashboard"], () => getDashboard(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  return (
    <Page title="Shops">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi,{" "}
          {userData.first_name.charAt(0).toUpperCase() +
            userData.first_name.slice(1)}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Number of Shops"
              total={dashboardData?.data.shops?.length}
              icon={"mdi:shop"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Number of Users"
              total={dashboardData?.data.users?.length}
              color="info"
              icon={"ph:users-three-bold"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Overall Services"
              total={dashboardData?.data.services?.length}
              color="warning"
              icon={"material-symbols:local-laundry-service-outline"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Deactivated Users"
              total={dashboardData?.data.deactivatedUser?.length}
              color="error"
              icon={"fa6-solid:users-slash"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Box sx={{ height: 300 }}>
              {dashboardStatus === 'success' ?(
                <AdminChart lineGraphData={dashboardData.data.usersGraph} />
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default AdminDashboardPage;
