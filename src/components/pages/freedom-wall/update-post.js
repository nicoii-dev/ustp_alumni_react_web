import React, {useState} from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { TextField, capitalize, Button, Box } from "@mui/material";
import _ from "lodash";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import MyDropzone from "../../dropzone/Dropzone";
// redux
import { setPostImages, setImagesToDelete, setPostData, setPostTitle } from "../../../store/slice/PostSlice";

// api
import postApi from "../../../lib/services/postApi";
import { LoadingButton } from "@mui/lab";

export default function UpdatePost({ handleClose }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userData = getLocalStorageItem("userData");
  const authToken = getLocalStorageItem("userToken");
  const { post, images, imagesToDelete } = useSelector((store) => store.post);
  const { updatePost } = postApi;
  const [updateLoading, setUpdateLoading] = useState(false);

  const ImageUrlToBlob = React.useCallback(async () => {
    const mappedImages = [];
    await Promise.all(
      images.map(async (data) => {
        const response = await fetch(
          "http://localhost:8000/storage/" + data?.url,
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
          "http://localhost:8000/storage/" + data?.url,
          {
            type: blob.type,
          }
        );
        mappedImages.push({
          fileId: data.id,
          file,
          imageUrl: "http://localhost:8000/storage/" + data?.url,
          //   imageUrl: URL.createObjectURL(file),
        });
      })
    );
    await dispatch(setPostImages([...mappedImages]));
  }, [dispatch]);

  React.useEffect(() => {
    ImageUrlToBlob();
  }, [ImageUrlToBlob]);

  const onSubmit = async () => {
    setUpdateLoading(true)
    const formData = new FormData();
    formData.append("title", post.title);
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete[]", imagesToDelete);
    }
    images.forEach((image_file) => {
      if (image_file.file.size !== 0)
        formData.append("images[]", image_file?.file);
    });
    await axios
      .post(
        `http://localhost:8000/api/post/update/${post.id}`,
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
        setUpdateLoading(false)
        queryClient.invalidateQueries(["get-all-posts"]);
        toast.success("Updated successfully");
        dispatch(setPostImages([]));
        dispatch(setPostData({}));
        handleClose();
      })
      .catch((e) => {
        console.log(e);
        setUpdateLoading(false)
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
      <TextField
        label="What's on your mind, User?"
        multiline={99}
        sx={{ width: "95%" }}
        value={post.title}
        onChange={(e) => dispatch(setPostTitle(e.target.value))}
      />
      <CardContent>
        <MyDropzone
          images={images}
          setImages={setPostImages}
          imagesToDelete={imagesToDelete}
          setImagesToDelete={setImagesToDelete}
        />
      </CardContent>

      <LoadingButton
        loading={updateLoading}
        variant="contained"
        sx={{width: '50%'}}
        onClick={onSubmit}
        disabled={_.isEmpty(post.title) && _.isEmpty(images)}
      >
        Update
      </LoadingButton>
    </Box>
  );
}
