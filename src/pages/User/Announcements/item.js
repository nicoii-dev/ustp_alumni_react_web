import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { yellow } from "@mui/material/colors";
import { Grid, capitalize, Box } from "@mui/material";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import announcementApi from "../../../lib/services/announcementApi";
import Iconify from "../../../components/Iconify";
import { toast } from "react-toastify";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";

export default function UserAnnouncementItem({ announcement }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { pinAnnouncement } = announcementApi;
  const queryClient = useQueryClient();
  const userData = getLocalStorageItem("userData")
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { mutate: PinnedAnnouncement, isLoading: pinIsLoading } = useMutation(
    (id) => pinAnnouncement(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-announcements"]);
        queryClient.invalidateQueries(["get-all-pinned-announcements"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );
    console.log(announcement)
    console.log(userData.id)
    console.log(announcement.user_id === userData.id.toString())
  return (
    <Card sx={{ maxWidth: "100%", marginTop: 2, backgroundColor: "#F5F5F5" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: yellow[700] }} aria-label="recipe">
            A
          </Avatar>
        }
        title={
          <Typography
            sx={{ fontSize: 20, fontWeight: "medium" }}
          >{`${capitalize(announcement?.title)}`}</Typography>
        }
        action={
          announcement.user_id !== userData.id.toString() ? (
            <div>
              <IconButton
                aria-label="settings"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <Iconify icon="tdesign:more" />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose()
                    PinnedAnnouncement(announcement.id);
                  }}
                >
                  Pin this Announcement
                </MenuItem>
              </Menu>
            </div>
          ) : null
        }
        subheader={moment(announcement.created_at).format("LLL")}
      />

      <CardContent>
        <Typography variant="body1" color="text.secondary" fontSize={18}>
          {announcement.announcement}
        </Typography>
      </CardContent>
      {announcement.announcement_images.length > 1 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 0 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ paddingBottom: 1, gap: 1, justifyContent: "center" }}
        >
          {announcement?.announcement_images.map((data, index) => {
            return (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <CardMedia
                  component="img"
                  height="400vh"
                  image={
                    `${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data.url
                  }
                  alt={
                    `${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data.url
                  }
                  sx={{
                    objectFit: "cover",
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : announcement.announcement_images.length < 1 ? null : (
        <CardMedia
          component="img"
          height="700"
          image={
            `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
            announcement?.announcement_images[0]?.url
          }
          alt={
            `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
            announcement?.announcement_images[0]?.url
          }
          sx={{
            objectFit: "contain",
            marginBottom: 1,
            // borderColor: "gray",
            // borderWidth: 1,
            // borderStyle: "solid",
          }}
        />
      )}
      {/* <Box
        display={"flex"}
        justifyContent={"space-between"}
        sx={{
          padding: 1,
          paddingLeft: 5,
          paddingRight: 5,
          borderTop: 1,
          borderColor: "#E0E0E0",
        }}
      >
        <Typography sx={{ color: "gray" }}>Like</Typography>
        <Typography sx={{ color: "gray" }}>Comment</Typography>
      </Box> */}
    </Card>
  );
}
