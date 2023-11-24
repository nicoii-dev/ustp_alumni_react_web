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
import Page from "../../../components/Page";
import AppTable from "../../../components/AppTable";
import DialogModal from "../../../components/DialogModal";
import Iconify from "../../../components/Iconify";

import trainingApi from "../../../lib/services/trainingApi";
import CreateTraining from "../../../components/pages/trainings/CreateTraining";

// redux
import { setTraining } from "../../../store/slice/TrainingSlice";
import UpdateTrainingComponent from "../../../components/pages/trainings/UpdateTraining";


function TrainingsPage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getUserTraining, deleteTraining } = trainingApi;
  const [trainingList, setTrainingList] = useState([]);
  const [action, setAction] = useState("");

  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(setTraining(""));
  };

  const {
    data: trainingData,
    status: trainingStatus,
    isFetching: trainingIsFetching,
  } = useQuery(["get-all-user-training"], () => getUserTraining(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isDeleteLoading } = useMutation(
    (id) => deleteTraining(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-user-training"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  useEffect(() => {
    if (trainingStatus === "success") {
        setTrainingList(
        trainingData?.data?.map((data) => ({
          tobeSearch: data?.title,
          title: data?.title,
          duration: data.duration ? data.duration : "N/A",
          institution: data.institution ? data.institution : "N/A",
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
  }, [Delete, dispatch, trainingData?.data, trainingStatus]);

  return (
    <Page title="Trainings">
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: "#CCE5FF",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h4">Trainings</Typography>
        </Box>

        <AppTable
          // tableTitle={"Citation Records"}
          buttonTitle={"Add Training"}
          buttonFunction={() => {
            openDialog();
            setAction("create");
          }}
          TABLE_HEAD={[
            // { id: "id", label: "ID", align: "center" },
            { id: "title", label: "Title", align: "center" },
            { id: "duration", label: "Duration(hours)", align: "center" },
            { id: "institution", label: "Institution", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={trainingList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={action === "create" ? "Adding Training" : "Updating Training"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === "create" ? (
          <CreateTraining handleClose={handleClose} />
        ) : (
          <UpdateTrainingComponent handleClose={handleClose} />
        )}
      </DialogModal>
    </Page>
  );
}

export default TrainingsPage;
