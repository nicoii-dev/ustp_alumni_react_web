import React, { useState } from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import moment from "moment/moment";
import { useQueryClient } from "react-query";
import { TextField, capitalize, Box, Stack } from "@mui/material";
import _ from "lodash";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import MyDropzone from "../../dropzone/Dropzone";
// redux
import { setAnnouncementImages } from "../../../store/slice/AnnouncementSlice";
import { LoadingButton } from "@mui/lab";
import { AnnouncementSchema } from "../../../lib/yup-schema/AnnouncementSchema";
import { RHFTextField, FormProvider } from "../../hook-form";

export default function CreateAnnouncement({ handleClose }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userData = getLocalStorageItem("userData");
  const { images } = useSelector((store) => store.announcement);
  const [createIsLoading, setCreateIsLoading] = useState(false);
  const authToken = getLocalStorageItem("userToken");

  const defaultValues = {
    title: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(AnnouncementSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    setCreateIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("announcement", data.announcement);
    images.forEach((image_file) => {
      formData.append("images[]", image_file.file);
    });
    await axios
      .post(`${process.env.REACT_APP_API_LOCAL_URL}/api/announcement/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((e) => {
        queryClient.invalidateQueries(["get-all-announcements"]);
        toast.success(e.data.message);
        dispatch(setAnnouncementImages([]));
        setCreateIsLoading(false);
        handleClose();
      })
      .catch((e) => {
        setCreateIsLoading(false);
        toast.error(e.response.data.message);
      });
  };

  return (
    <Box sx={{ maxWidth: "90vh" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {capitalize(userData.first_name[0])}
          </Avatar>
        }
        title={`${capitalize(userData.first_name)} ${capitalize(
          userData.middle_name
        )} ${capitalize(userData.last_name)}`}
        subheader={moment(new Date()).format("LL")}
        titleTypographyProps={{
          display: "flex",
          justifyContent: "flex-start",
          fontSize: 16,
          fontWeight: "bold",
        }}
        subheaderTypographyProps={{
          display: "flex",
          justifyContent: "flex-start",
          paddingBottom: 1,
          marginTop: -0.5,
        }}
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <RHFTextField name="title" label="Title(required)" />
          <RHFTextField name="announcement" label="Announcement" multiline={99} />
        </Stack>

      <CardContent>
        <MyDropzone images={images} setImages={setAnnouncementImages} />
      </CardContent>

      <LoadingButton
        loading={createIsLoading}
        // sx={{ backgroundColor: "#0080FF", width: "95%", color: "white" }}
        variant="contained"
        sx={{width: '50%'}}
        type="submit"
      >
        Post
      </LoadingButton>
      </FormProvider>
    </Box>
  );
}
