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

import achievementsApi from "../../../lib/services/achievementsApi";

// redux
import { setTraining } from "../../../store/slice/TrainingSlice";
import moment from "moment";
import CreateJobHistory from "./Create";
import { setAchievement } from "../../../store/slice/AchievementSlice";
import UpdateAchievement from "./Update";
import CreateAchievement from "./Create";

function AchievementsPage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getAllAchievements, deleteAchievements } = achievementsApi;
  const [achievementsList, setAchievementsList] = useState([]);
  const [action, setAction] = useState("");

  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(setTraining(""));
  };

  const {
    data: achievemensData,
    status: achievementStatus,
    // isFetching: trainingIsFetching,
  } = useQuery(["get-all-user-achievements"], () => getAllAchievements(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const { mutate: Delete, isLoading: isDeleteLoading } = useMutation(
    (id) => deleteAchievements(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-user-achievements"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );
    console.log(achievemensData)
  useEffect(() => {
    if (achievementStatus === "success") {
        setAchievementsList(
        achievemensData?.data?.map((data) => ({
          tobeSearch: data?.title,
          title: data?.title,
          category: data?.category,
          date: moment(data.date).format("LL"),
          description: data.description,
          action: (
            <>
              <Tooltip title="Update Post">
                <IconButton
                  onClick={() => {
                    dispatch(setAchievement(data));
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
  }, [Delete, dispatch, achievemensData?.data, achievementStatus]);

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: 5 }}>
        <AppTable
          hasSearch={false}
          tableTitle={"Achievements"}
          buttonTitle={"Add Achievement"}
          buttonFunction={() => {
            openDialog();
            setAction("create");
          }}
          TABLE_HEAD={[
            // { id: "id", label: "ID", align: "center" },
            { id: "title", label: "Title", align: "center" },
            { id: "category", label: "Category", align: "center" },
            { id: "date", label: "Date", align: "center" },
            { id: "description", label: "Description", align: "center" },
            { id: "action", label: "Action", align: "center" },
          ]}
          TABLE_DATA={achievementsList}
        />
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={
          action === "create" ? "Adding Achievement" : "Updating Achievement"
        }
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === "create" ? (
          <CreateAchievement handleClose={handleClose} />
        ) : (
          <UpdateAchievement handleClose={handleClose} />
        )}
      </DialogModal>
    </>
  );
}

export default AchievementsPage;
