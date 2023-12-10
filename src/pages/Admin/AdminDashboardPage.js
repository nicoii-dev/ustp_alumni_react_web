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
  console.log(dashboardData)
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi,{" "}
          {userData?.first_name?.charAt(0)?.toUpperCase() +
            userData?.first_name?.slice(1)}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Number of Alumni"
              total={dashboardData?.data?.alumni}
              icon={"fa6-solid:user-graduate"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Number of Courses"
              total={dashboardData?.data?.course?.length || 0}
              color="info"
              icon={"ph:users-three-bold"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Active Users"
              total={dashboardData?.data?.active}
              color="warning"
              icon={"ph:users-three-bold"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetAdmin
              title="Deactivated Users"
              total={dashboardData?.data?.deactivated}
              color="error"
              icon={"fluent-mdl2:deactivate-orders"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Box sx={{ height: 300 }}>
              <AdminChart lineGraphData={[]} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default AdminDashboardPage;
