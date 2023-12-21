import React, { useEffect, useState, useCallback } from "react";
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
import employmentApi from "../../../lib/services/employmentApi";
import { useDispatch, useSelector } from "react-redux";
import CreateJobPost from "../../../components/pages/job-posting/create-job";

// redux
import {
  setType,
  setReasons,
  setOccupation,
  setStatus,
  setLineOfBusiness,
  setEmploymentId,
} from "../../../store/slice/EmploymentStatusSlice";
import EmploymentStatus from "../../../components/pages/profile/EmploymentStatus";
import JobHistory from "../../../components/pages/job-history/JobHistory";

function EmploymentPage() {
  const dispatch = useDispatch();
  const { getEmployment } = employmentApi;

  const {
    data: employmentData,
    status: employmentStatus,
    // isFetching: jobsIsFetching,
  } = useQuery(["get-user-employment"], () => getEmployment(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  const employmentHandler = useCallback(() => {
    if(employmentStatus === 'success') {
      dispatch(setEmploymentId(employmentData.data.id));
      dispatch(setStatus(employmentData.data.status));
      dispatch(setOccupation(employmentData.data.present_occupation));
      dispatch(setReasons(employmentData.data.state_of_reasons || []));
      dispatch(setType(employmentData.data.type));
      dispatch(setLineOfBusiness(employmentData.data.line_of_business));
    }

  }, [dispatch, employmentData, employmentStatus])

  useEffect(() => {
    employmentHandler()
  }, [employmentHandler]);

  return (
    <Page title="Employment">
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: "#CCE5FF",
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h4">Employment Details</Typography>
        </Box>
        <EmploymentStatus />
        <JobHistory />
      </Container>
    </Page>
  );
}

export default EmploymentPage;
