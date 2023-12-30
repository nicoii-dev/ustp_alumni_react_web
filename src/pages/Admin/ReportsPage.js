import React, { useEffect, useState } from "react";
import { useQuery} from "react-query";
// mui
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
} from "@mui/material";
// components
import Page from "../../components/Page";
import reportsApi from "../../lib/services/reportsApi";
import AdminLineGraph from "../../components/AdminLineGraph";

function ReportsPage() {
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
    <Page title="Reports">
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "#CCE5FF", padding: 2, borderRadius: 2 }}>
          <Typography variant="h4">Reports Page</Typography>
        </Box>
        <Grid container spacing={3} sx={{ marginTop: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card style={{ height: 350, overflow: "auto" }}>
              <Typography
                style={{ padding: 20, fontSize: 20, fontWeight: "bold" }}
              >
                {`Employed: ${reportsList?.total_employed}`}
              </Typography>
              {reportsList?.employed?.map((data, index) => {
                return (
                  <Typography
                    style={{
                      paddingLeft: 20,
                      marginTop: 0,
                      fontSize: 16,
                      textTransform: "capitalize",
                      fontStyle: 'italic' 
                    }}
                  >
                    {`${index + 1}. ${data.user.first_name} ${
                      data.user.middle_name
                    } ${data.user.last_name} (${data?.user.alumni.course})`}
                  </Typography>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <Box sx={{ height: 350 }}>
            <AdminLineGraph lineGraphData={employedLabel.map(a => a.quantity)} lineLabel={employedLabel.map(a => a.course)} label="Employed"/>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card style={{ height: 350, overflow: "auto" }}>
              <Typography
                style={{ padding: 20, fontSize: 20, fontWeight: "bold"}}
              >
                {`Unemployed: ${reportsList?.total_unemployed}`}
              </Typography>
              {reportsList?.unemployed?.map((data, index) => {
                return (
                  <Typography
                    style={{
                      paddingLeft: 20,
                      marginTop: 0,
                      fontSize: 16,
                      textTransform: "capitalize",
                      fontStyle: 'italic'
                    }}
                  >
                    {`${index + 1}. ${data.user.first_name} ${
                      data.user.middle_name
                    } ${data.user.last_name} (${data?.user.alumni.course})`}
                  </Typography>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <Box sx={{ height: 350 }}>
              <AdminLineGraph lineGraphData={unEmployedLabel.map(a => a.quantity)} lineLabel={unEmployedLabel.map(a => a.course)} label="Unemployed"/>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default ReportsPage;
