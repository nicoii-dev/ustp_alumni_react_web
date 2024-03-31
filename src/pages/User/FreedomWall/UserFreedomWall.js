import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
// mui
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  capitalize,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import { toast } from "react-toastify";
// components
import Page from "../../../components/Page";
import FreedomWallItem from "../../../components/pages/freedom-wall/item";
import DialogModal from "../../../components/DialogModal";
import CreatePost from "../../../components/pages/freedom-wall/create-post";

// api
import postApi from "../../../lib/services/postApi";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
// redux
import { setPostImages, setPostData } from "../../../store/slice/PostSlice";
import UpdatePost from "../../../components/pages/freedom-wall/update-post";

function UserFreedomWallPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { getAllPost, createPost, likePost, unlikePost } = postApi;
  const [open, setOpen] = useState(false);
  const [postList, setPostList] = useState([]);
  const { title, images } = useSelector((store) => store.post);
  const [action, setAction] = useState("");
  const userData = getLocalStorageItem("userData");

  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(setPostData(""));
    dispatch(setPostImages([]));
  };

  const {
    data: postData,
    status: postStatus,
    isFetching: postIsFetching,
  } = useQuery(["get-all-posts"], () => getAllPost(), {
    retry: 3, // Will retry failed requests 10 times before displaying an error
  });

  useEffect(() => {
    if (postStatus === "success") {
      setPostList(postData?.data);
    }
  }, [postData, postStatus]);

  const { mutate: Like, isLoading: isLikeLoading } = useMutation(
    (payload) => likePost(payload),
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

  return (
    <Page title="Alumnus">
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "#CCE5FF", padding: 2, borderRadius: 2 }}>
          <Typography variant="h4">Freedom Wall</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "10vh",
              width: "90vh",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#E0E0E0",
              paddingLeft: 0,
              borderRadius: 1,
              gap: 1,
            }}
          >
            {userData.image ? (
              <Avatar
                src={
                  userData.image
                    ? `${process.env.REACT_APP_API_LOCAL_URL}/storage/${userData.image}`
                    : "/static/ustp_logo.png"
                }
                alt="photoURL"
                sx={{ objectFit: "contain" }}
              />
            ) : (
              <Avatar sx={{ bgcolor: yellow[700] }} aria-label="recipe">
                {capitalize(userData?.first_name.charAt(0))}
              </Avatar>
            )}
            <Box></Box>
            <Button
              variant="outlined"
              sx={{ width: "85%", justifyContent: "flex-start" }}
              onClick={() => {
                openDialog();
                setAction("create");
              }}
            >
              What's on your mind, User?
            </Button>
          </Box>
          {postList?.map((post) => {
            return (
              <FreedomWallItem
                post={post}
                Like={Like}
                openDialog={openDialog}
                setAction={setAction}
              />
            );
          })}
        </Box>
      </Container>

      <DialogModal
        open={open}
        handleClose={handleClose}
        title={action === "create" ? "Creating Post" : "Updating Post"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        {action === "create" ? (
          <CreatePost handleClose={handleClose} />
        ) : (
          <UpdatePost handleClose={handleClose} />
        )}
      </DialogModal>
    </Page>
  );
}

export default UserFreedomWallPage;
