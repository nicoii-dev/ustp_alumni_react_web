import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import _ from "lodash";
// mui
import { Container, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../../components/Page";
import AppTable from "../../../components/AppTable";
import DialogModal from "../../../components/DialogModal";
import Iconify from "../../../components/Iconify";
import { useDispatch } from "react-redux";
import CreateAnnouncement from "../../../components/pages/announcements/create-announcement";
import UpdateAnnouncement from "../../../components/pages/announcements/update-announcement";

// api
import announcementApi from "../../../lib/services/announcementApi";

// redux
import {
  setAnnouncement,
  setAnnouncementImages,
} from "../../../store/slice/AnnouncementSlice";

function AnnouncementsPage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getAllAnnouncement, deleteAnnouncement } = announcementApi;
  const [jobPostList, setJobPostList] = useState([]);
  const [action, setAction] = useState("");
  const [images, setImages] = useState([]);

  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(setAnnouncementImages([]));
    dispatch(
      setAnnouncement({
        id: "",
        title: "",
        announcement: "",
        images: [],
      })
    );
  };

  const {
    data: announcementData,
    status: announcementStatus,
    isFetching: announcementIsFetching,
  } = useQuery(["get-all-announcements"], () => getAllAnnouncement(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isDeleteLoading } = useMutation(
    (id) => deleteAnnouncement(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-announcements"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    if (announcementStatus === "success") {
      setJobPostList(
        announcementData?.data?.map((data) => ({
          tobeSearch: data?.title,
          id: <span>{`#${data.id}`}</span>,
          title: data.title ? data.title : "N/A",
          announcement: data.announcement ? data.announcement : "N/A",
          images: (
            <img
              src={
                !_.isUndefined(data?.announcement_images[0]?.url)
                  ? "http://localhost:8000/storage/" +
                    data?.announcement_images[0]?.url
                  : "static/no-image.jpg"
              }
              alt={data?.title}
              width="150"
              height="100"
              style={{
                objectFit: "contain",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                marginLeft: 50,
              }}
            />
          ),
          action: (
            <>
              <Tooltip title="Update Post">
                <IconButton
                  onClick={() => {
                    dispatch(setAnnouncement(data));
                    setImages(data.announcement_images);
                    openDialog();
                    setAction("update");
                  }}
                  // disabled={data.status !== "2"}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Post">
                <IconButton
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Delete(data.id);
                        Swal.fire(
                          "Deleted!",
                          "Your file has been deleted.",
                          "success"
                        );
                      }
                    });
                  }}
                >
                  <Iconify icon="material-symbols:delete-outline" />
                </IconButton>
              </Tooltip>
            </>
          ),
        }))
      );
    }
  }, [Delete, announcementData?.data, announcementStatus, dispatch]);

  return (
    <Page title="Announcements">
      <Container maxWidth="xl">
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

        <AppTable
          // tableTitle={"Citation Records"}
          buttonTitle={"New Announcement"}
          buttonFunction={() => {
            openDialog();
            setAction("create");
          }}
          TABLE_HEAD={[
            // { id: "id", label: "ID", align: "center" },
            { id: "title", label: "Title", align: "center" },
            { id: "announcement", label: "Announcement", align: "center" },
            { id: "images", label: "Images", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={jobPostList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={
          action === "create"
            ? "Creating Announcement"
            : "Updating Announcement"
        }
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === "create" ? (
          <CreateAnnouncement handleClose={handleClose} />
        ) : (
          <UpdateAnnouncement
            announcementImages={images}
            handleClose={handleClose}
          />
        )}
      </DialogModal>
    </Page>
  );
}

export default AnnouncementsPage;
