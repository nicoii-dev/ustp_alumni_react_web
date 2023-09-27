import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
// mui
import { Container, Typography, Box, Avatar, Button } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../components/Page";
import userApi from "../../lib/services/userApi";
import FreedomWallItem from "../../components/pages/freedom-wall/item";
import DialogModal, { useDialog } from "../../components/DialogModal";
import CreatePost from "../../components/pages/freedom-wall/create-post";
import RHFTextField from "../../components/hook-form/RHFTextField";

const example_data = [
  { id: "1", title: "", images: "", content: "First Name", status: "" },
  { id: "2", title: "", images: "", content: "First Name", status: "" },
  { id: "3", title: "", images: "", content: "First Name", status: "" },
  { id: "4", title: "", images: "", content: "First Name", status: "" },
  { id: "5", title: "", images: "", content: "First Name", status: "" },
];
function FreedomWallPage() {
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const queryClient = useQueryClient();
  const { getUser, activateUser, deactivateUser } = userApi;
  const [usersList, setUsersList] = useState([]);

  const {
    data: usersData,
    status: usersStatus,
    isFetching: usersIsFetching,
  } = useQuery(["get-users"], () => getUser(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: activate, isLoading: activateUserLoading } = useMutation(
    (id) => activateUser(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-users"]);
        toast.success("User activated successfully");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const { mutate: deactivate, isLoading: deactivateUserLoading } = useMutation(
    (id) => deactivateUser(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-users"]);
        toast.success("User deactivated successfully");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  return (
    <Page title="Alumnus">
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "#CCE5FF", padding: 2, borderRadius: 2 }}>
          <Typography variant="h4">Freedom Wall</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "10vh",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#E0E0E0",
              paddingLeft: 0,
              borderRadius: 1,
              gap: 1,
            }}
          >
            <Avatar
              src={
                "https://www.rd.com/wp-content/uploads/2021/09/GettyImages-1181334518-MLedit.jpg"
              }
              alt="photoURL"
              sx={{ height: 50, width: 50 }}
            />
            <Box></Box>
            <Button
              variant="outlined"
              sx={{ width: "85%", justifyContent: "flex-start" }}
              onClick={() => openDialog()}
            >
              What's on your mind, User?
            </Button>
          </Box>
          {example_data.map(() => {
            return <FreedomWallItem />;
          })}
        </Box>
      </Container>

      <DialogModal
        {...dialogProps}
        title={"Creating post"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: 'relatie' },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        <CreatePost />
      </DialogModal>
    </Page>
  );
}

export default FreedomWallPage;
