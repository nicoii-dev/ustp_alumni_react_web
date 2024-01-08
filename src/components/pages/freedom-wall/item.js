import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Iconify from "../../Iconify";
import { Grid, capitalize, Box, Button, TextField } from "@mui/material";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import DialogModal from "../../DialogModal";
import { setPostImages, setPostData } from "../../../store/slice/PostSlice";

import postApi from "../../../lib/services/postApi";
import commentApi from "../../../lib/services/commentApi";

import PostComponent from "./post";

export default function FreedomWallItem({ post, Like, openDialog, setAction }) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPost, setOpenPost] = React.useState(false);
  const open = Boolean(anchorEl);
  const userData = getLocalStorageItem("userData");
  const { unlikePost, deletePost } = postApi;
  const { comment } = commentApi;
  const { commentData } = useSelector((store) => store.comment);

  const { mutate: Unlike, isLoading: isUnlikeLoading } = useMutation(
    (id) => unlikePost(id, { post_id: post.id }),
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

  const openPostHandler = () => {
    setOpenPost(true);
  };
  const closePostHandler = () => {
    setOpenPost(false);
  };

  const { mutate: Delete, isLoading: isDeleteLoading } = useMutation(
    (id) => deletePost(id),
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

  const { mutate: createComment, isLoading: commentIsLoading } = useMutation(
    (payload) => comment(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-posts"]);
        queryClient.invalidateQueries(["get-all-comments"]);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  return (
    <Card sx={{ maxWidth: "90vh" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {capitalize(post?.post_owner?.first_name.charAt(0))}
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
              {post.post_owner.id === userData.id ? (
                <MenuItem
                  onClick={() => {
                    setAction("update");
                    dispatch(setPostImages(post.post_images));
                    dispatch(setPostData(post));
                    handleClose();
                    openDialog();
                  }}
                >
                  Update
                </MenuItem>
              ) : null}
              {userData.role !== "admin" &&
              userData.id !== post.post_owner.id ? (
                <MenuItem onClick={handleClose}>Report</MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, remove it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Delete(post.id);
                        Swal.fire(
                          "Deleted!",
                          "Your file has been deleted.",
                          "success"
                        );
                      }
                    });
                  }}
                >
                  Remove
                </MenuItem>
              )}
              {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
            </Menu>
          </div>
        }
        title={
          post?.post_owner?.first_name === "admin"
            ? "Admin"
            : `${capitalize(post?.post_owner?.first_name)} ${capitalize(
                post?.post_owner?.middle_name
              )} ${capitalize(post?.post_owner?.last_name)}`
        }
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
        {post.post_images.length > 1 ? (
          <Grid
            container
            spacing={{ xs: 2, md: 0 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ paddingBottom: 1, gap: 1, justifyContent: "center" }}
          >
            {post.post_images.map((data, index) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <CardMedia
                    component="img"
                    height="400vh"
                    image={
                      `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
                      data.url
                    }
                    alt={
                      `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
                      data.url
                    }
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : post.post_images.length < 1 ? null : (
          <CardMedia
            component="img"
            height="700"
            image={
              `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
              post.post_images[0]?.url
            }
            alt={
              `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
              post.post_images[0]?.url
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
              const likeData = post.post_likes.find(
                (ele) => ele.post_id === post.id
              );
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

        <Button sx={{ width: "45%", gap: 1 }} onClick={openPostHandler}>
          <Iconify
            icon="iconamoon:comment-bold"
            sx={{ color: "#A0A0A0" }}
            width={30}
            height={30}
          />
          <Typography sx={{ color: "gray", fontSize: 20 }}>Comment</Typography>
        </Button>
      </Box>
      <DialogModal
        open={openPost}
        handleClose={closePostHandler}
        title={`${capitalize(post.post_owner.first_name)}'s Post`}
        styles={{
          // div: { textAlign: "flex-start" },
          title: {
            fontSize: 25,
            position: "relative",
            padding: 20,
            textAlign: "center",
          },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="md"
        hasTextField
        btnFunction={() => {
          createComment({
            post_id: post.id,
            comment: commentData,
          });
        }}
      >
        <PostComponent
          post={post}
          Like={Like}
          openDialog={openDialog}
          setAction={setAction}
        />
      </DialogModal>
    </Card>
  );
}
