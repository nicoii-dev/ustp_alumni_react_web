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
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";

// redux
import { setPostTitle, setPostImages } from "../../../store/slice/PostSlice";

export default function CreatePost({ onSubmit }) {
  const dispatch = useDispatch();
  const userData = getLocalStorageItem("userData");
  const { title, images } = useSelector((store) => store.post);
  
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
        <MyDropzone images={images} setImages={setPostImages}/>
      </CardContent>

        <Button
          sx={{ backgroundColor: "#0080FF", width: "95%", color: "white" }}
          onClick={onSubmit}
          disabled={_.isEmpty(title) && _.isEmpty(images)}
        >
          Post
        </Button>
    </Box>
  );
}
