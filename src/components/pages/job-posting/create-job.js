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
import { setJobTitle, setJobDescription, setJobPostImages } from "../../../store/slice/JobSlice";

export default function CreateJobPost({ onSubmit }) {
  const dispatch = useDispatch();
  const userData = getLocalStorageItem("userData");
  const { title, description, images } = useSelector((store) => store.job);

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
        <MyDropzone images={images} setImages={setJobPostImages}/>
      </CardContent>

      <Button
        sx={{ backgroundColor: "#0080FF", width: "95%", color: "white" }}
        onClick={onSubmit}
        disabled={(_.isEmpty(title) || _.isEmpty(description)) && _.isEmpty(images)}
      >
        Post
      </Button>
    </Box>
  );
}
