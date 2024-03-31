import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { yellow } from "@mui/material/colors";
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

export default function ImportCsv() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: "90vh",  }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: yellow[700] }} aria-label="recipe">
            R
          </Avatar>
        }
        title="Shrimp and Chorizo Paella"
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
          multiline={100}
          sx={{width: '95%'}}
        />
      <CardContent>
        <MyDropzone />
      </CardContent>
      <CardActions disableSpacing sx={{justifyContent: 'center'}}>
        <Button sx={{backgroundColor: '#0080FF', width: '95%', color: 'white'}}>
          Import
        </Button>
      </CardActions>
    </Card>
  );
}
