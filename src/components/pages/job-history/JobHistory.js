import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
// mui
import { Container, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../Page";
import AppTable from "../../AppTable";
import DialogModal from "../../DialogModal";
import Iconify from "../../Iconify";

import jobHistoryApi from "../../../lib/services/jobHistoryApi";

// redux
import { setTraining } from "../../../store/slice/TrainingSlice";
import moment from "moment";
import CreateJobHistory from "./Create";

function JobHistory() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getAllJobHistory, deleteJobHistory } = jobHistoryApi;
  const [jobHistoryList, setJobHistoryList] = useState([]);
  const [action, setAction] = useState("");

  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(setTraining(""));
  };

  const {
    data: jobData,
    status: jobStatus,
    // isFetching: trainingIsFetching,
  } = useQuery(["get-all-user-job-history"], () => getAllJobHistory(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isDeleteLoading } = useMutation(
    (id) => deleteJobHistory(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-user-job-history"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    if (jobStatus === "success") {
      setJobHistoryList(
        jobData?.data?.map((data) => ({
          tobeSearch: data?.title,
          company: data?.company,
          position: data?.position,
          dateStarted: moment(data.date_started).format("LL"),
          dateEnded: moment(data.date_ended).format("LL"),
          salary: data.salary,
          status: data.status,
          action: (
            <>
              <Tooltip title="Update Post">
                <IconButton
                  onClick={() => {
                    dispatch(setTraining(data));
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
  }, [Delete, dispatch, jobData?.data, jobStatus]);

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: 5 }}>
        <AppTable
          hasSearch={false}
          tableTitle={"Job History"}
          buttonTitle={"Add Job"}
          buttonFunction={() => {
            openDialog();
            setAction("create");
          }}
          TABLE_HEAD={[
            // { id: "id", label: "ID", align: "center" },
            { id: "company", label: "Title", align: "center" },
            { id: "position", label: "Position", align: "center" },
            { id: "dateStarted", label: "Date Started", align: "center" },
            { id: "dateEnded", label: "Date Ended", align: "center" },
            { id: "salary", label: "Salary", align: "center" },
            { id: "status", label: "Status", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={jobHistoryList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={
          action === "create" ? "Adding Job History" : "Updating Job History"
        }
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === "create" ? (
          <CreateJobHistory handleClose={handleClose} />
        ) : (
          <CreateJobHistory handleClose={handleClose} />
        )}
      </DialogModal>
    </>
  );
}

export default JobHistory;
