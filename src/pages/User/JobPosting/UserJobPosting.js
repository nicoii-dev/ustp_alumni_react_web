import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
// mui
import { Container, Typography, Box, Tooltip, IconButton } from "@mui/material";

// components
import Page from "../../../components/Page";
import UserAnnouncementItem from "./item";

// api
import announcementApi from "../../../lib/services/announcementApi";
import jobPostingApi from "../../../lib/services/jobPostingApi";
import Iconify from "../../../components/Iconify";

function UserJobPosting() {
  const { getAllJob } = jobPostingApi;

  const {
    data: jobData,
    status: jobStatus,
    isFetching: jobIsFetching,
  } = useQuery(["get-all-jobs"], () => getAllJob(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  return (
    <Page title="Job Posting">
      <Container maxWidth="xl" sx={{ justifyContent: "center" }}>
        <Box
          sx={{
            backgroundColor: "#CCE5FF",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h4">Job Posting</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {jobData?.data?.length > 0 ? (
            <Box sx={{ width: "70%" }}>
              {jobData?.data?.map((job) => {
                return <UserAnnouncementItem jobPosting={job} />;
              })}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                justifySelf: 'center',
                justifyContent: "center",
                alignItems: "center",
                alignContent: 'center',
                backgroundColor: '#DCDCDC',
                borderRadius: 1,
                width: '50%',
                paddingTop: 5,
                paddingBottom: 5,
                marginTop: 10
              }}
            >
              <Iconify
                icon={"iconoir:info-empty"}
                sx={{ alignSelf: "center", justifySelf: 'center', width: 100, height: 100 }}
              />
              <Typography sx={{ fontSize: 50, fontFamily: "cursive" }}>
                No Data
              </Typography>
              <Typography sx={{ fontSize: 50, fontFamily: "cursive" }}>
                Available
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Page>
  );
}

export default UserJobPosting;
