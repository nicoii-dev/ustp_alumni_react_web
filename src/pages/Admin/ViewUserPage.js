import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
// mui
import {
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
  CardContent,
  Card,
  Avatar,
  Stack,
  Chip,
  Grid,
  Skeleton,
  Tab,
} from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { toast } from "react-toastify";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";

import userApi from "../../lib/services/userApi";
import AppTable from "../../components/AppTable";
import EmploymentStatus from "../../components/pages/profile/EmploymentStatus";
import {
  setType,
  setReasons,
  setOccupation,
  setStatus,
  setLineOfBusiness,
  setEmploymentId,
} from "../../store/slice/EmploymentStatusSlice";

function ViewUserPage() {
  const dispatch = useDispatch();
  const { viewUser } = userApi;
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("Employment");
  const [jobHistoryList, setJobHistoryList] = useState([]);
  const [trainingsList, setTrainingsList] = useState([]);

  const {
    data: userData,
    status: userStatus,
    isFetching,
  } = useQuery(["view-user"], () => viewUser(userId), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (userStatus === "success") {
      setUser(userData.data);
    }
  }, [userData, userStatus]);
  useEffect(() => {
    if (userStatus === "success") {
      setJobHistoryList(
        userData?.data?.job_history?.map((data) => ({
          tobeSearch: data?.title,
          company: data?.company,
          position: data?.position,
          dateStarted: moment(data.date_started).format("LL"),
          dateEnded: moment(data.date_ended).format("LL"),
          salary: data.salary,
          status: data.status,
        }))
      );
      setTrainingsList(
        userData?.data?.trainings?.map((data) => ({
          tobeSearch: data?.title,
          title: data?.title,
          topic: data?.topic,
          date: moment(data.date).format("LL"),
          duration: data.duration,
          institution: data.institution,
        }))
      );
    }
  }, [userData?.data?.job_history, userStatus]);

  const employmentHandler = useCallback(() => {
    if (userStatus === "success") {
      dispatch(setEmploymentId(user?.employment?.id));
      dispatch(setStatus(user?.employment?.status));
      dispatch(setOccupation(user?.employment?.present_occupation));
      dispatch(setReasons(user?.employment?.state_of_reasons || []));
      dispatch(setType(user?.employment?.type));
      dispatch(setLineOfBusiness(user?.employment?.line_of_business));
    }
  }, [dispatch, user?.employment]);

  useEffect(() => {
    employmentHandler();
  }, [employmentHandler]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Page title="View User">
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: "#CCE5FF",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h4">View User</Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Card>
              {isFetching ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={500}
                  sx={{ bgcolor: "#E0E0E0" }}
                />
              ) : (
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding={5}
                    height={450}
                  >
                    <Stack direction="column" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{ width: 150, height: 150 }}
                        src={user?.image}
                      />
                      <Typography
                        variant="h5"
                        gutterBottom
                        textAlign="center"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {`${user?.first_name}  ${user?.middle_name} ${user?.last_name}`}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {user?.email}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {"BSIT"}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="contain" gutterBottom>
                            Status
                          </Typography>
                          {/* <Typography variant="body2" gutterBottom>
                          Disabling this user will prevent them from logging in.
                        </Typography> */}
                        </Stack>
                        <Chip
                          color={user?.status ? "warning" : "error"}
                          label={user?.status ? "Active" : "Inactive"}
                          onClick={() => {
                            // changeStatus(user?.id);
                          }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="contain" gutterBottom>
                            Email Verified
                          </Typography>
                          {/* <Typography variant="body2" gutterBottom>
                          Disabling this will automatically send the user a
                          verification email
                        </Typography> */}
                        </Stack>
                        <Chip
                          color={user?.is_verified ? "success" : "error"}
                          label={
                            user?.is_verified ? "Verified" : "Not Verified"
                          }
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              {isFetching ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={500}
                  sx={{ bgcolor: "#E0E0E0" }}
                />
              ) : (
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    padding={5}
                    height={450}
                  >
                    <Stack
                      direction="column"
                      alignItems="flex-start"
                      justifyContent={"space-evenly"}
                      spacing={0}
                    >
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-evenly"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="subtitle1" gutterBottom>
                            Date of Birth:
                          </Typography>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                          {user?.dob}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="subtitle1" gutterBottom>
                            Gender:
                          </Typography>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                          {user?.gender}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="subtitle1" gutterBottom>
                            Civil Status:
                          </Typography>
                        </Stack>
                        <Typography variant="h6" gutterBottom sx={{textTransform: 'capitalize'}}>
                          {user?.civil_status}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="subtitle1" gutterBottom>
                            Phone Number:
                          </Typography>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                          {user?.phone_number}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={2}
                      >
                        <Stack>
                          <Typography variant="subtitle1" gutterBottom>
                            Address:
                          </Typography>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                          {`${user?.address?.street}, ${user?.address?.barangay}, ${user?.address?.city}, ${user?.address?.province}, ${user?.address?.region}`}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ marginTop: 5 }}>
          <TabContext value={activeTab}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Employment Details" value="Employment" />
              <Tab label="Trainings" value="Trainings" />
            </TabList>
            <TabPanel value="Employment">
              <EmploymentStatus admin={false} />
              <AppTable
                hasSearch={false}
                hasButton={false}
                TABLE_HEAD={[
                  { id: "company", label: "Title", align: "center" },
                  { id: "position", label: "Position", align: "center" },
                  { id: "dateStarted", label: "Date Started", align: "center" },
                  { id: "dateEnded", label: "Date Ended", align: "center" },
                  { id: "salary", label: "Salary", align: "center" },
                  { id: "status", label: "Status", align: "center" },
                ]}
                TABLE_DATA={jobHistoryList || []}
              />
            </TabPanel>
            <TabPanel value="Trainings">
              <AppTable
                hasButton={false}
                hasSearch={false}
                TABLE_HEAD={[
                  // { id: "id", label: "ID", align: "center" },
                  { id: "title", label: "Title", align: "center" },
                  { id: "topic", label: "Topic", align: "center" },
                  { id: "date", label: "Date", align: "center" },
                  { id: "duration", label: "Duration(hours)", align: "center" },
                  { id: "institution", label: "Institution", align: "center" },
                ]}
                TABLE_DATA={trainingsList || []}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </Page>
  );
}

export default ViewUserPage;
