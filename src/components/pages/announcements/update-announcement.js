import React, { useState, useEffect } from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import moment from "moment/moment";
import MyDropzone from "../../dropzone/Dropzone";
import { capitalize, Box, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import { RHFTextField, FormProvider } from "../../hook-form";
// redux
import { setAnnouncement, setAnnouncementImages, setImagesToDelete } from "../../../store/slice/AnnouncementSlice";
import { LoadingButton } from "@mui/lab";
import { AnnouncementSchema } from "../../../lib/yup-schema/AnnouncementSchema";

export default function UpdateAnnouncement({ announcementImages, handleClose }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userData = getLocalStorageItem("userData");
  const { announcement, images, imagesToDelete } = useSelector(
    (store) => store.announcement
  );
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const authToken = getLocalStorageItem("userToken");

  const defaultValues = {
    title: "",
    announcement: "",
  };

  const methods = useForm({
    resolver: yupResolver(AnnouncementSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  console.log(announcement)
  useEffect(() => {
    reset({
      title: announcement.title,
      announcement: announcement.announcement
    })
  }, [reset, announcement])

  const ImageUrlToBlob = React.useCallback(async () => {
    const mappedImages = [];
    await Promise.all(
      announcementImages.map(async (data) => {
        const response = await fetch(
          `${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data?.url,
          {
            method: "GET",
            mode: "no-cors",
            // cache: "no-cache",
            headers: {
              Origin: window.location.origin,
            },
          }
        );

        // here image is url/location of image
        const blob = await response.blob();
        const file = new File(
          [blob],
          `${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data?.url,
          {
            type: blob.type,
          }
        );
        mappedImages.push({
          fileId: data.id,
          file,
          imageUrl: `${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data?.url,
          //   imageUrl: URL.createObjectURL(file),
        });
      })
    );
    await dispatch(setAnnouncementImages([...mappedImages]));
  }, [dispatch, announcementImages]);

  React.useEffect(() => {
    ImageUrlToBlob();
  }, [ImageUrlToBlob]);

  const onUpdate = async (data) => {
    setUpdateIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("announcement", data.announcement);
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete[]", imagesToDelete);
    }
    images.forEach((image_file) => {
      if (image_file.file.size !== 0)
        formData.append("images[]", image_file?.file);
    });
    await axios
      .post(
        `${process.env.REACT_APP_API_LOCAL_URL}/announcement/update/${announcement.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((e) => {
        queryClient.invalidateQueries(["get-all-announcements"]);
        toast.success(e.data.message);
        dispatch(setAnnouncement(""));
        dispatch(setAnnouncementImages([]));
        setUpdateIsLoading(false);
        handleClose();
      })
      .catch((e) => {
        setUpdateIsLoading(false);
        console.log(e);
        // toast.error(e.response.data.message);
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onUpdate)}>
        <Stack spacing={1}>
          <RHFTextField name="title" label="Title(required)" />
          <RHFTextField name="announcement" label="Announcement" multiline={99} />
        </Stack>

        <CardContent>
          <MyDropzone
            images={images}
            setImages={setAnnouncementImages}
            imagesToDelete={imagesToDelete}
            setImagesToDelete={setImagesToDelete}
          />
        </CardContent>

        <LoadingButton
          variant="contained"
          sx={{ width: "50%" }}
          loading={updateIsLoading}
          type="submit"
        >
          Update
        </LoadingButton>
      </FormProvider>
    </Box>
  );
}
