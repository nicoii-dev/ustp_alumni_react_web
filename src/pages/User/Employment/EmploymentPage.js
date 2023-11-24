import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
// mui
import { Container, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../../components/Page";
import AppTable from "../../../components/AppTable";
import DialogModal from "../../../components/DialogModal";
import Iconify from "../../../components/Iconify";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";

// api
import jobPostingApi from "../../../lib/services/jobPostingApi";
import { useDispatch, useSelector } from "react-redux";
import CreateJobPost from "../../../components/pages/job-posting/create-job";

// redux
import {
  setJobTitle,
  setJobDescription,
  setJobPostImages,
  setJob,
} from "../../../store/slice/JobSlice";
import UpdateJobPost from "../../../components/pages/job-posting/update-job";

function EmploymentPage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const authToken = getLocalStorageItem("userToken");
  const queryClient = useQueryClient();
  const { getAllJob, deleteJob } = jobPostingApi;
  const [jobPostList, setJobPostList] = useState([]);
  const [action, setAction] = useState("");
  const [jobImages, setJobImages] = useState([]);

  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(setJobPostImages([]));
    dispatch(setJobTitle(""));
    dispatch(setJobDescription(""));
  };

  const {
    data: jobsData,
    status: jobsStatus,
    isFetching: jobsIsFetching,
  } = useQuery(["get-all-jobs"], () => getAllJob(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isDeleteLoading } = useMutation(
    (id) => deleteJob(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-jobs"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    if (jobsStatus === "success") {
      setJobPostList(
        jobsData?.data?.map((data) => ({
          tobeSearch: data?.title,
          id: <span>{`#${data.id}`}</span>,
          title: data.title ? data.title : "N/A",
          description: data.description ? data.description : "N/A",
          images: (
            <img
              src={
                !_.isUndefined(data?.job_images[0]?.url)
                  ? "http://localhost:8000/storage/" + data?.job_images[0]?.url
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
                    dispatch(setJob(data));
                    dispatch(setJobTitle(data.title));
                    dispatch(setJobDescription(data.description));
                    setJobImages(data.job_images);
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
  }, [Delete, dispatch, jobsData?.data, jobsStatus]);

  return (
    <Page title="Job-Posting">
      <Container maxWidth="xl">
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

        <AppTable
          // tableTitle={"Citation Records"}
          buttonTitle={"New Job Post"}
          buttonFunction={() => {
            openDialog();
            setAction("create");
          }}
          TABLE_HEAD={[
            // { id: "id", label: "ID", align: "center" },
            { id: "title", label: "Title", align: "center" },
            { id: "description", label: "Description", align: "center" },
            { id: "images", label: "Images", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={jobPostList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={action === "create" ? "Creating Job Post" : "Updating Job Post"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === "create" ? (
          <CreateJobPost handleClose={handleClose} />
        ) : (
          <UpdateJobPost jobImages={jobImages} handleClose={handleClose} />
        )}
      </DialogModal>
    </Page>
  );
}

export default EmploymentPage;
