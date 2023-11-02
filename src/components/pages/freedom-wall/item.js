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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Iconify from "../../Iconify";
import { Grid, capitalize, Box, Button } from "@mui/material";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";

import postApi from "../../../lib/services/postApi";

export default function FreedomWallItem({ post, Like }) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userData = getLocalStorageItem("userData");
  const {unlikePost} = postApi;

  const { mutate: Unlike, isLoading: isUnlikeLoading } = useMutation(
    (id) => unlikePost(id, {'post_id': post.id}),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-posts"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ maxWidth: "90vh" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
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
              <MenuItem onClick={handleClose}>Update</MenuItem>
              <MenuItem onClick={handleClose}>Delete</MenuItem>
              {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
            </Menu>
          </div>
        }
        title={`${capitalize(post?.post_owner?.first_name)} ${capitalize(
          post?.post_owner?.middle_name
        )} ${capitalize(post?.post_owner?.first_name)}`}
        subheader={moment(post.created_at).format("LL")}
      />

      <CardContent>
        <Typography variant="body1" color="text.secondary">
          {post.title}
        </Typography>
      </CardContent>
      <Grid
        container
        spacing={{ xs: 2, md: 0 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ paddingBottom: 1 }}
      >
        {post?.post_images.map((data, index) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <CardMedia
                component="img"
                height="250vh"
                image={"http://localhost:8000/storage/" + data.url}
                alt={"http://localhost:8000/storage/" + data.url}
                sx={{
                  objectFit: "contain",
                  borderColor: "gray",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      <Box
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
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-evenly"}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          borderTop: 1,
          borderColor: "#E0E0E0",
        }}
      >
        <Button
          sx={{ width: "45%", gap: 1 }}
          onClick={() => {
            if (post.post_likes.some((el) => el.user_id === userData.id)) {
              const likeData = post.post_likes.find(ele => ele.post_id === post.id)
              Unlike(likeData.id, { post_id: post.id });
              return;
            }
            Like({ post_id: post.id });
          }}
        >
          <Iconify
            icon={
              post.post_likes.some((el) => el.user_id === userData.id)
                ? "mdi:like"
                : "mdi:like-outline"
            }
            sx={{
              color: post.post_likes.some((el) => el.user_id === userData.id)
                ? "#0080FF"
                : "#A0A0A0",
            }}
            width={30}
            height={30}
          />
          <Typography
            sx={{
              color: post.post_likes.some((el) => el.user_id === userData.id)
                ? "#0080FF"
                : "#A0A0A0",
              fontSize: 20,
            }}
          >
            Like
          </Typography>
        </Button>

        <Button sx={{ width: "45%", gap: 1 }}>
          <Iconify
            icon="iconamoon:comment-bold"
            sx={{ color: "#A0A0A0" }}
            width={30}
            height={30}
          />
          <Typography sx={{ color: "gray", fontSize: 20 }}>Comment</Typography>
        </Button>
      </Box>
    </Card>
  );
}
