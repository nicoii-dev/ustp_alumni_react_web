import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
// mui
import { Container, Typography, Box, Grid, Card } from "@mui/material";
// components
import Page from "../../components/Page";
import reportsApi from "../../lib/services/reportsApi";
import DialogModal, { useDialog } from "../../components/DialogModal";
import TracerWidget from "../../components/sections/@dashboard/app/TracerWidget";

function TracerPages() {
  const { getTracer } = reportsApi;
  const [reportsList, setReportsList] = useState([]);
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const [courseData, setCourseData] = useState("");
  const [employedData, setEmployedData] = useState();
  const [unEmployedData, setUnEmployedData] = useState();

  const {
    data: reportsData,
    status: reportsStatus,
    // isFetching: usersIsFetching,
  } = useQuery(["get-tracer"], () => getTracer(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
  useEffect(() => {
    if (reportsStatus === "success") {
      setReportsList(reportsData.data);
    }
  }, [reportsStatus, reportsData]);
  console.log(reportsList);
  const EmploymentData = (course) => {
    openDialog();
    setCourseData(course.course);
    setEmployedData(
      // eslint-disable-next-line array-callback-return
      reportsList.employed.filter((data) => {
        if (data?.user?.alumni.course === course.course) {
            return data?.user?.alumni;
        }
      })
    );

    setUnEmployedData(
        // eslint-disable-next-line array-callback-return
        reportsList.unemployed.filter((data) => {
          if (data?.user?.alumni.course === course.course) {
              return data?.user?.alumni;
          }
        })
      );
  };
  console.log(employedData);
  return (
    <Page title="Tracer">
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "#CCE5FF", padding: 2, borderRadius: 2 }}>
          <Typography variant="h4">Tracer Page</Typography>
        </Box>
        <Box
          container
          spacing={3}
          sx={{
            justifyItems: "center",
            marginTop: 1,
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Grid container spacing={3} sx={{ marginTop: 1 }}>
            {reportsList?.courses?.map((data, index) => {
              if (data.course !== "")
                return (
                  <Grid item>
                    <div
                      onClick={() => EmploymentData(data)}
                      style={{ cursor: "pointer" }}
                    >
                      <TracerWidget
                        title={data.course}
                        total={data?.count}
                        icon={"fa6-solid:user-graduate"}
                        sx={{ width: 200 }}
                      />
                    </div>
                  </Grid>
                );
            })}
          </Grid>
        </Box>
      </Container>
      <DialogModal
        {...dialogProps}
        title={courseData}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25 },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="md"
      >
        {" "}
        <Grid container spacing={3} sx={{ marginTop: 1 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Card
              style={{
                height: 350,
                overflow: "auto",
                justifyItems: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Typography
                style={{ padding: 20, fontSize: 20, fontWeight: "bold" }}
              >
                {`Employed: ${employedData?.length}`}
              </Typography>
              {employedData?.map((data, index) => {
                return (
                  <Typography
                    style={{
                      paddingLeft: 20,
                      marginTop: 0,
                      fontSize: 16,
                      textTransform: "capitalize",
                      fontStyle: "italic",
                      textAlign: 'left'
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
          <Grid item xs={12} sm={6} md={6}>
            <Card style={{ height: 350, overflow: "auto" }}>
              <Typography
                style={{ padding: 20, fontSize: 20, fontWeight: "bold" }}
              >
                {`Unemployed: ${unEmployedData?.length}`}
              </Typography>
              {unEmployedData?.map((data, index) => {
                return (
                  <Typography
                    style={{
                      paddingLeft: 20,
                      marginTop: 0,
                      fontSize: 16,
                      textTransform: "capitalize",
                      fontStyle: "italic",
                      textAlign: 'left'
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
        </Grid>
      </DialogModal>
    </Page>
  );
}

export default TracerPages;
