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

export default function PinnedItem({ announcement, pinnedId, announcementImages }) {
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl2);
  const { unpinAnnouncement } = announcementApi;
  const queryClient = useQueryClient();
  const handleClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl2(null);
  };
  const { mutate: UnPinnedAnnouncement, isLoading: pinIsLoading } = useMutation(
    (id) => unpinAnnouncement(id),
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
          announcement.pinned === "1" ? (
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
                id="basic-menu2"
                anchorEl={anchorEl2}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    UnPinnedAnnouncement(pinnedId);
                  }}
                >
                  Unpin this Announcement
                </MenuItem>
              </Menu>
            </div>
          ) : null
        }
        subheader={moment(announcement.created_at).format("LL")}
      />

      <CardContent>
        <Typography variant="body1" color="text.secondary" fontSize={18}>
          {announcement.announcement}
        </Typography>
      </CardContent>
      {announcementImages.length > 1 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 0 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ paddingBottom: 1, gap: 1, justifyContent: "center" }}
        >
          {announcementImages.map((data, index) => {
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
      ) : announcementImages.length < 1 ? null : (
        <CardMedia
          component="img"
          height="700"
          image={
            `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
            announcementImages[0]?.url
          }
          alt={
            `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
            announcementImages[0]?.url
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
