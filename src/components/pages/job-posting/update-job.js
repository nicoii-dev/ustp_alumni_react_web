import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import moment from "moment/moment";
import MyDropzone from "../../dropzone/Dropzone";
import { TextField, capitalize, Button, Box } from "@mui/material";
import _ from "lodash";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";

// redux
import {
  setJobTitle,
  setJobDescription,
  setJobPostImages,
} from "../../../store/slice/JobSlice";

export default function UpdateJobPost({ onSubmit }) {
  const dispatch = useDispatch();
  const userData = getLocalStorageItem("userData");
  const { title, description, images } = useSelector((store) => store.job);

  const ImageUrlToBlob = React.useCallback(async () => {
    const mappedImages = [];
    // await Promise.all(
    //   images.map(async (data) => {
    //     const response = await fetch(
    //       "http://localhost:8000/storage/" + data?.url,
    //       {
    //         method: "GET",
    //         mode: "cors",
    //         cache: "no-cache",
    //         headers: {
    //           Origin: window.location.origin,
    //         },
    //       }
    //     );
    //     // here image is url/location of image
    //     const blob = await response.blob();
    //     const file = new File([blob], data?.url, {
    //       type: blob.type,
    //     });
    //     mappedImages.push({
    //       fileId: data.id,
    //       isCurrent: data.isCurrent,
    //       file,
    //       imageUrl: URL.createObjectURL(file),
    //     });
    //   })
    // );
    // await dispatch(setJobPostImages([...mappedImages]));
    console.log("http://localhost:8000/storage/" + images[0]?.url);
    const di = axios
      .get("http://localhost:8000/storage/" + images[0]?.url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Origin: window.location.origin,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
    })
      .then((res) => {
        return res.data;
      });
  }, [dispatch]);

  React.useEffect(() => {
    ImageUrlToBlob();
  }, [ImageUrlToBlob]);

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
        label="Title"
        multiline={99}
        sx={{ width: "95%" }}
        onChange={(e) => dispatch(setJobTitle(e.target.value))}
      />
      <TextField
        label="Description?"
        multiline={99}
        sx={{ width: "95%", marginTop: 1 }}
        onChange={(e) => dispatch(setJobDescription(e.target.value))}
      />
      <CardContent>
        <MyDropzone images={images} setImages={setJobPostImages} />
      </CardContent>

      <Button
        sx={{ backgroundColor: "#0080FF", width: "95%", color: "white" }}
        onClick={onSubmit}
        disabled={
          (_.isEmpty(title) || _.isEmpty(description)) && _.isEmpty(images)
        }
      >
        Post
      </Button>
    </Box>
  );
}
