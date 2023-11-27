import React, {useState} from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { TextField, capitalize, Box } from "@mui/material";
import axios from "axios";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import MyDropzone from "../../dropzone/Dropzone";
// redux
import {
  setPostData,
  setPostImages,
  setPostTitle,
} from "../../../store/slice/PostSlice";

// api
import postApi from "../../../lib/services/postApi";
import { LoadingButton } from "@mui/lab";

export default function CreatePost({ handleClose }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userData = getLocalStorageItem("userData");
  const authToken = getLocalStorageItem("userToken");
  const [updateLoading, setUpdateLoading] = useState(false);
  const { post, images } = useSelector((store) => store.post);
  const { createPost } = postApi;
  const { mutate: Create, isLoading: isCreateLoading } = useMutation(
    (payload) => createPost(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-posts"]);
        toast.success("Created successfully");
        dispatch(setPostImages([]));
        dispatch(setPostData({}));
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
    formData.append("title", post.title);
    images.forEach((image_file) => {
      formData.append("images[]", image_file.file);
    });
    await axios
      .post(
        `${process.env.REACT_APP_API_LOCAL_URL}/api/post/create`,
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
        toast.success("Created successfully");
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
        onChange={(e) => dispatch(setPostTitle(e.target.value))}
      />
      <CardContent>
        <MyDropzone images={images} setImages={setPostImages} />
      </CardContent>

      <LoadingButton
        loading={isCreateLoading}
        variant="contained"
        sx={{ width: "50%" }}
        onClick={onSubmit}
        disabled={_.isEmpty(post.title) && _.isEmpty(images)}
      >
        Post
      </LoadingButton>
    </Box>
  );
}
