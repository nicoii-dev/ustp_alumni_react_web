import React from "react";
import { useQuery } from "react-query";
// mui
import { Container, Typography, Box } from "@mui/material";
import Iconify from "../../../components/Iconify";

// components
import Page from "../../../components/Page";
import UserAnnouncementItem from "./item";

// api
import announcementApi from "../../../lib/services/announcementApi";

function UserAnnouncements() {
  const { getAllAnnouncement } = announcementApi;

  const {
    data: announcementData,
    status: announcementStatus,
    isFetching: announcementIsFetching,
  } = useQuery(["get-all-announcements"], () => getAllAnnouncement(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  return (
    <Page title="Announcements">
      <Container maxWidth="xl" sx={{ justifyContent: "center" }}>
        <Box
          sx={{
            backgroundColor: "#CCE5FF",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h4">Announcements</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {announcementData?.data?.length > 0 ? (
            <Box sx={{ width: "70%" }}>
              {announcementData?.data?.map((announcement) => {
                return <UserAnnouncementItem announcement={announcement} />;
              })}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                justifySelf: "center",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                backgroundColor: "#DCDCDC",
                borderRadius: 1,
                width: "50%",
                paddingTop: 5,
                paddingBottom: 5,
                marginTop: 10,
              }}
            >
              <Iconify
                icon={"iconoir:info-empty"}
                sx={{
                  alignSelf: "center",
                  justifySelf: "center",
                  width: 100,
                  height: 100,
                }}
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

export default UserAnnouncements;
