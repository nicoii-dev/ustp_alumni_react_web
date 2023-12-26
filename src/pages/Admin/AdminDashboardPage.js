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
import AdminLineGraph from "../../components/AdminLineGraph";
import reportsApi from "../../lib/services/reportsApi";

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

  const { getReports } = reportsApi;
  const [reportsList, setReportsList] = useState([]);
  const [unEmployedLabel, setUnemployedLabel] = useState([]);
  const [employedLabel, setEmployedLabel] = useState([]);

  const {
    data: reportsData,
    status: reportsStatus,
    // isFetching: usersIsFetching,
  } = useQuery(["get-reports"], () => getReports(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
  useEffect(() => {
    if (reportsStatus === "success") {
      setReportsList(reportsData.data);
      let unLabel = [];
      reportsData?.data?.unemployed?.map((data) => {
        let itemIndex = unLabel.filter(
          (elem) => elem.course === data.user.alumni.course
        )[0];
        if (itemIndex) {
          itemIndex.quantity++;
        } else {
          unLabel.push({
            course: data.user.alumni.course,
            quantity: 1,
          });
        }
      });
      setUnemployedLabel(unLabel);

      let label = [];
      reportsData?.data?.employed?.map((data) => {
        let itemIndex = label.filter(
          (elem) => elem.course === data.user.alumni.course
        )[0];
        if (itemIndex) {
          itemIndex.quantity++;
        } else {
          label.push({
            course: data.user.alumni.course,
            quantity: 1,
          });
        }
      });
      setEmployedLabel(label);
    }
  }, [reportsStatus, reportsData]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Hi,{" "}
          {userData?.first_name?.charAt(0)?.toUpperCase() +
            userData?.first_name?.slice(1)}
        </Typography> */}

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
              <AdminLineGraph
                lineGraphData={employedLabel.map((a) => a.quantity)}
                lineLabel={employedLabel.map((a) => a.course)}
                label="Employed"
                lineGraphData2={unEmployedLabel.map((a) => a.quantity)}
                lineLabel2={unEmployedLabel.map((a) => a.course)}
                label2="Unemployed"
                dashboard={true}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default AdminDashboardPage;
