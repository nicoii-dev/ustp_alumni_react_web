import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
// mui
import { Container, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../components/Page";
import AppTable from "../../components/AppTable";
import userApi from "../../lib/services/userApi";
import { LoadingButton } from "@mui/lab";
import DialogModal, {useDialog} from "../../components/DialogModal";
import CreateAnnouncement from "../../components/pages/announcements/CreateAnnouncement";

const TABLE_HEAD = [
  { id: "firstName", label: "First Name", alignRight: false },
  { id: "lastName", label: "Last Name", alignRight: false },
  { id: "gender", label: "Gender", alignRight: false },
  { id: "phoneNumber", label: "Phone Number", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "isVerified", label: "Is Verified", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const { getUser, activateUser, deactivateUser } = userApi;
  const [usersList, setUsersList] = useState([]);
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();

  const {
    data: usersData,
    status: usersStatus,
    isFetching: usersIsFetching,
  } = useQuery(["get-users"], () => getUser(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });



  return (
    <Page title="Announcement">
      <Container maxWidth="xl">
        {/* <Box sx={{ backgroundColor: "#CCE5FF", padding: 2, borderRadius: 2 }}>
          <Typography variant="h4">
            Announcements
          </Typography>
        </Box> */}

        <AppTable
          tableTitle={"Announcements"}
          buttonTitle={"New Announcement"}
          buttonFunction={() => openDialog()}
          TABLE_HEAD={TABLE_HEAD}
          TABLE_DATA={usersList}
        />
      </Container>

      <DialogModal
        {...dialogProps}
        title={"Creating Announcement"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: 'relatie' },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        <CreateAnnouncement />
      </DialogModal>
    </Page>
  );
}

export default AnnouncementsPage;
