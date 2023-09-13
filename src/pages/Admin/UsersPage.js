import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
// mui
import { Container, Typography, Grid } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../components/Page";
import AppTable from "../../components/AppTable";
import userApi from "../../lib/services/userApi";
import { LoadingButton } from "@mui/lab";

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

function UsersPage() {
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

  useEffect(() => {
    if (usersStatus === "success") {
      setUsersList(
        usersData?.data?.map((data) => ({
          id: <span>{`#${data.id}`}</span>,
          firstName:
            data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
          lastName:
            data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
          gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
          phoneNumber: data.phone_number,
          email: data.email,
          role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
          isVerified: (
            <>
              {data.is_verified === "1" ? (
                <Typography sx={{ color: "green" }}>Verified</Typography>
              ) : (
                <Typography sx={{ color: "red" }}>Not verified</Typography>
              )}
            </>
          ),
          status: (
            <>
              {data.status === "1" ? (
                <LoadingButton sx={{backgroundColor: 'green'}} onClick={() => {onActivateHandler(data.id)}} loading={activateUserLoading}>
                  <Typography sx={{color:'white', fontSize: 14, padding: .5}}>Activated</Typography>
                </LoadingButton>
              ) : (
                <LoadingButton sx={{backgroundColor: 'red'}} onClick={() => {onDeactivateHandler(data.id)}} loading={deactivateUserLoading}>
                  <Typography sx={{color:'white', fontSize: 14, padding: .5}}>Deactivated</Typography>
                </LoadingButton>
              )}
            </>
          ),
        }))
      );
    }
  }, [usersData?.data, usersStatus, usersIsFetching]);

  const onActivateHandler = (id) => {
    Swal.fire({
      // title: "Are you sure you want to Activate this user?",
      text: "Are you sure you want to Deactivate this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deactivate(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    });
  };

  const onDeactivateHandler = (id) => {
    Swal.fire({
      // title: "Are you sure you want to Deactivate this user?",
      text: "Are you sure you want to Activate this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, activate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        activate(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    });
  };

  return (
    <Page title="Shops">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Users Page
        </Typography>

        <AppTable
          // tableTitle={"Citation Records"}
          buttonTitle={"New User"}
          TABLE_HEAD={TABLE_HEAD}
          TABLE_DATA={usersList}
        />
      </Container>
    </Page>
  );
}

export default UsersPage;
