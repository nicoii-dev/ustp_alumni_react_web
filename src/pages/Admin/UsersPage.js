import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
// mui
import {
  Container,
  Typography,
  Box,
  Tooltip,
  Link,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
// components
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import AppTable from "../../components/AppTable";
import userApi from "../../lib/services/userApi";
import { LoadingButton } from "@mui/lab";

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
      const newList = usersData.data.filter((item) => item?.role !== "admin");
      console.log(newList);
      setUsersList(
        newList?.map((data) => ({
          tobeSearch: data.last_name,
          id: <span>{`#${data.id}`}</span>,
          firstName:
            data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
          middleName:
            data.middle_name.charAt(0).toUpperCase() +
            data.middle_name.slice(1),
          lastName:
            data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
          gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
          phoneNumber: data.phone_number,
          email: data.email,
          role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
          isVerified: (
            <>
              {data.is_verified === 1 ? (
                <Typography sx={{ color: "green" }}>VERIFIED</Typography>
              ) : (
                <Typography sx={{ color: "red" }}>NOT VERIFIED</Typography>
              )}
            </>
          ),
          status: (
            <>
              {data.status === 1 ? (
                <LoadingButton
                  sx={{ backgroundColor: "green" }}
                  onClick={() => {
                    onActivateHandler(data.id);
                  }}
                  loading={activateUserLoading}
                >
                  <Typography
                    sx={{ color: "white", fontSize: 14, padding: 0.5 }}
                  >
                    Activated
                  </Typography>
                </LoadingButton>
              ) : (
                <LoadingButton
                  sx={{ backgroundColor: "red" }}
                  onClick={() => {
                    onDeactivateHandler(data.id);
                  }}
                  loading={deactivateUserLoading}
                >
                  <Typography
                    sx={{ color: "white", fontSize: 14, padding: 0.5 }}
                  >
                    Deactivated
                  </Typography>
                </LoadingButton>
              )}
            </>
          ),
          action: (
            <>
              <Tooltip title="View User">
                <Link
                  href={`users/view-user/${data.id}`}
                  // target="_blank"
                  // rel="noopener noreferrer"
                  style={{ cursor: "pointer" }}
                >
                  <IconButton
                  // disabled={data.status !== "2"}
                  >
                    <Iconify icon="ic:baseline-remove-red-eye" />
                  </IconButton>
                </Link>
              </Tooltip>
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
    <Page title="Users">
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "#CCE5FF", padding: 2, borderRadius: 2 }}>
          <Typography variant="h4">Users Page</Typography>
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <AppTable
            // tableTitle={"Citation Records"}
            buttonTitle={"New User"}
            TABLE_HEAD={[
              { id: "firstName", label: "First Name", alignRight: false },
              { id: "middleName", label: "Middle Name", alignRight: false },
              { id: "lastName", label: "Last Name", alignRight: false },
              { id: "email", label: "Email", alignRight: false },
              { id: "isVerified", label: "Verification", alignRight: false },
              { id: "status", label: "Status", alignRight: false },
              { id: "action", label: "Action", alignRight: false },
              { id: "" },
            ]}
            TABLE_DATA={usersList}
          />
        </Box>
      </Container>
    </Page>
  );
}

export default UsersPage;
