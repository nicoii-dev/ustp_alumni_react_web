import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
// mui
import { Container, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../../components/Page";
import AppTable from "../../../components/AppTable";
import DialogModal, { useDialog } from "../../../components/DialogModal";
import Iconify from "../../../components/Iconify";

// api
import jobPostingApi from "../../../lib/services/jobPostingApi";
import { useDispatch, useSelector } from "react-redux";
import CreateJobPost from "../../../components/pages/job-posting/create-job";

// redux
import {
  setJobTitle,
  setJobDescription,
  setJobPostImages,
} from "../../../store/slice/JobSlice";
import UpdateJobPost from "../../../components/pages/job-posting/update-job";

function JobPostingPage() {
  const dispatch = useDispatch();
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const queryClient = useQueryClient();
  const { getAllJob, createJob, updateJob } = jobPostingApi;
  const [jobPostList, setJobPostList] = useState([]);
  const [action, setAction] = useState('');
  const { title, images } = useSelector((store) => store.post);

  const {
    data: jobsData,
    status: jobsStatus,
    isFetching: jobsIsFetching,
  } = useQuery(["get-all-jobs"], () => getAllJob(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });
  console.log(jobsData);
  useEffect(() => {
    if (jobsStatus === "success") {
      setJobPostList(
        jobsData?.data?.map((data) => ({
          id: <span>{`#${data.id}`}</span>,
          title: data.title ? data.title : "N/A",
          description: data.description ? data.description : "N/A",
          images: (
            <img
              src={"http://localhost:8000/storage/" + data.job_images[0].url}
              alt={data?.title}
              width="150"
              height="100"
              style={{ objectFit: "contain", justifyContent: 'center', alignItems: 'center', display: 'flex', marginLeft: 50}}
            />
          ),
          action: (
            <>
              <Tooltip title="Update Post">
                <IconButton
                  onClick={() => {
                    dispatch(setJobTitle(data.title));
                    dispatch(setJobDescription(data.description));
                    dispatch(setJobPostImages(data.job_images));
                    openDialog();
                    setAction('update');
                  }}
                  // disabled={data.status !== "2"}
                >
                  <Iconify icon="ic:baseline-remove-red-eye" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Post">
                <IconButton
                  onClick={() => {
                    // dispatch(setAppointment(data));
                    openDialog();
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
  }, [jobsData?.data, jobsStatus]);

  const { mutate: Create, isLoading: isCreateLoading } = useMutation(
    (payload) => createJob(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-posts"]);
        toast.success("Posted Successfully");
        dispatch(setJobTitle(""));
        dispatch(setJobDescription(""));
        dispatch(setJobPostImages([]));
        handleClose();
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", title);
    images.forEach((image_file) => {
      formData.append("images[]", image_file.file);
    });
    await Create(formData);
  };

  const onUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", title);
    images.forEach((image_file) => {
      formData.append("images[]", image_file.file);
    });
    await Create(formData);
  };

  return (
    <Page title="Shops">
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
            setAction('create');
          }}
          TABLE_HEAD={[
            { id: "id", label: "ID", align: 'center' },
            { id: "title", label: "Title", align: 'center'  },
            { id: "description", label: "Description", align: 'center'  },
            { id: "images", label: "Images", align: 'center' },
            { id: "action", label: "Action", align: 'center' },
          ]}
          TABLE_DATA={jobPostList}
        />
      </Container>

      <DialogModal
        {...dialogProps}
        title={"Creating Job Post"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === 'create' ? <CreateJobPost onSubmit={onSubmit} /> : <UpdateJobPost onSubmit={onUpdate} />}

      </DialogModal>
    </Page>
  );
}

export default JobPostingPage;
