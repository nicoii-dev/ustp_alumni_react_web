import React from "react";
import { useQuery } from "react-query";
// mui
import { Container, Typography, Box, Button } from "@mui/material";
import Iconify from "../../../components/Iconify";

// components
import Page from "../../../components/Page";
import UserAnnouncementItem from "./item";
import DialogModal, { useDialog } from "../../../components/DialogModal";

// api
import announcementApi from "../../../lib/services/announcementApi";
import PinnedAnnouncements from "./PinnedAnnouncements";

function UserAnnouncements() {
  const { getAllAnnouncement } = announcementApi;
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();

  const {
    data: announcementData,
    status: announcementStatus,
    isFetching: announcementIsFetching,
  } = useQuery(["get-all-announcements"], () => getAllAnnouncement(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  return (
    <>
      <Page title="Announcements">
        <Container maxWidth="xl" sx={{ justifyContent: "center" }}>
          <Box
            sx={{
              backgroundColor: "#CCE5FF",
              padding: 2,
              borderRadius: 2,
              marginBottom: 2,
              display: "flex",
              justifyItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4">Announcements</Typography>
            <Button
              variant="h6"
              onClick={() => {
                setOpen(true);
              }}
            >
              View pinned announcements
            </Button>
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

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={"Pinned Announcements"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="lg"
      >
        <PinnedAnnouncements />
      </DialogModal>
    </>
  );
}

export default UserAnnouncements;
