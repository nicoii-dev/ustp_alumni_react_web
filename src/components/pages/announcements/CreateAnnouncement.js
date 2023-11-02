import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from "../../Iconify";
import moment from "moment/moment";
import MyDropzone from "../../dropzone/Dropzone";
import { Button, TextField } from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CreateAnnouncement() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: "90vh" }}>
      <TextField
        label="Title"
        multiline={100}
        sx={{ width: "95%", marginTop: 1 }}
      />
      <TextField
        label="Content"
        multiline={100}
        sx={{ width: "95%", marginTop: 1 }}
      />
      <CardContent>
        <MyDropzone />
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: "center" }}>
        <Button
          sx={{ backgroundColor: "#0080FF", width: "95%", color: "white" }}
        >
          Create
        </Button>
      </CardActions>
    </Card>
  );
}