import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Papa from "papaparse";
// mui
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  capitalize,
} from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../components/Page";
import AppTable from "../../components/AppTable";
import DialogModal, { useDialog } from "../../components/DialogModal";

// api
import alumniApi from "../../lib/services/alumniApi";
import { LoadingButton } from "@mui/lab";

const TABLE_HEAD = [
  { id: "firstName", label: "First Name" },
  { id: "middleName", label: "Middle Name" },
  { id: "lastName", label: "Last Name" },
  { id: "course", label: "Course", align: "center" },
  { id: "yearGraduated", label: "Year Graduated", align: "center" },
];

function AlumniListPage() {
  const { importCsv, getAllAlumni } = alumniApi;
  const queryClient = useQueryClient();
  const [alumniList, setAlumniList] = useState([]);
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();

  const [csvFile, setCsvFile] = useState({
    csv: undefined,
    data: [],
    initialize: false,
    invalidDataset: false,
  });

  const { data: alumniData, status: alumniStatus } = useQuery(
    ["get-all-alumni"],
    () => getAllAlumni(),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

  console.log(alumniData);
  useEffect(() => {
    if (alumniStatus === "success") {
      setAlumniList(
        alumniData?.data?.map((data) => ({
          tobeSearch: data?.last_name,
          firstName: capitalize(data?.first_name),
          middleName: capitalize(data?.middle_name),
          lastName: capitalize(data?.last_name),
          course: data?.course,
          yearGraduated: data?.year_graduated,
        }))
      );
    }
  }, [alumniStatus, alumniData?.data]);

  const { mutate: importCsvFile, isLoading: uploadLoading } = useMutation(
    (payload) => importCsv(payload),
    {
      onSuccess: (data) => {
        toast.success("Uploaded Successfully");
        queryClient.invalidateQueries(["get-all-alumni"]);
        handleClose();
      },
      onError: (data) => {
        toast.error("Something went wrong");
      },
    }
  );

  const convertCSV = (csv) => {
    console.log(csv);
    Papa.parse(csv, {
      download: true,
      header: false,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        const firstName = results.data[0].indexOf("First Name");
        const middleName = results.data[0].indexOf("Middle Name");
        const lastName = results.data[0].indexOf("Last Name");
        const course = results.data[0].indexOf("Course");
        const yearGraduated = results.data[0].indexOf("Year Graduated");

        if (
          firstName !== -1 &&
          middleName !== -1 &&
          lastName !== -1 &&
          course !== -1 &&
          yearGraduated !== -1
        ) {
          const temp = [];
          results.data.map((key, index) => {
            // eslint-disable-next-line no-plusplus
            if (index > 0) {
              temp.push({
                first_name: key[firstName] || "",
                middle_name: key[middleName] || "",
                last_name: key[lastName] || "",
                course: key[course] || "",
                year_graduated: key[yearGraduated] || "",
              });
            } else {
              setCsvFile({
                ...csvFile,
                csv,
                initialize: true,
                invalidDataset: true,
              });
            }
          });
          setCsvFile({
            ...csvFile,
            csv,
            data: temp,
            initialize: true,
            invalidDataset: false,
          });
        } else {
          toast.error("Invalid CSV File.");
          setCsvFile({
            ...csvFile,
            csv,
            initialize: true,
            invalidDataset: true,
          });
        }
      },
    });
  };

  const onUpload = () => {
    const formData = new FormData();
    formData.append("csv_data", JSON.stringify(csvFile.data));
    importCsvFile(formData);
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
          <Typography variant="h4">Alumni List</Typography>
        </Box>
        <AppTable
          buttonTitle={"Import CSV"}
          buttonFunction={() => openDialog()}
          TABLE_HEAD={TABLE_HEAD}
          TABLE_DATA={alumniList}
        />
      </Container>

      <DialogModal
        {...dialogProps}
        title={"Uploading Alumni CSV File"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {csvFile.csv !== undefined ? (
          <Typography sx={{ marginTop: 2, fontSize: 24, fontWeight: "bold" }}>
            {csvFile.csv.name}
          </Typography>
        ) : null}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={100}
        >
          <Button
            size="large"
            component="label"
            variant="text"
            disableElevation
          >
            <Stack direction="row" alignItems="center">
              <Typography variant="h4">Select file upload</Typography>
            </Stack>
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={(e) => {
                convertCSV(e.target.files[0]);
              }}
            />
          </Button>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
          <LoadingButton
            loading={uploadLoading}
            onClick={onUpload}
            sx={{ fontSize: 20 }}
          >
            Upload
          </LoadingButton>
        </Box>
      </DialogModal>
    </Page>
  );
}

export default AlumniListPage;
