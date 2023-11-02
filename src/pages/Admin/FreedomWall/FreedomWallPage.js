import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { useSelector, useDispatch} from "react-redux";
// mui
import { Container, Typography, Box, Avatar, Button } from "@mui/material";
import { toast } from "react-toastify";
// components
import Page from "../../../components/Page";
import FreedomWallItem from "../../../components/pages/freedom-wall/item";
import DialogModal, { useDialog } from "../../../components/DialogModal";
import CreatePost from "../../../components/pages/freedom-wall/create-post";

// api
import postApi from "../../../lib/services/postApi";

// redux
import { setPostImages, setPostTitle} from "../../../store/slice/PostSlice";

function FreedomWallPage() {
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { getAllPost, createPost, likePost, unlikePost } = postApi;
  const [postList, setPostList] = useState([]);
  const { title, images } = useSelector((store) => store.post);
  console.log(title);
  console.log(images);

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

  const { mutate: Create, isLoading: isCreateLoading } = useMutation(
    (payload) => createPost(payload),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-posts"]);
        toast.success("Created successfully");
        dispatch(setPostImages([]));
        dispatch(setPostTitle(''));
        handleClose();
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    images.forEach((image_file) => {
      formData.append("images[]", image_file.file);
    });
    await Create(formData);
  };

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

    console.log(postList)
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
            <Avatar
              src={
                "https://www.rd.com/wp-content/uploads/2021/09/GettyImages-1181334518-MLedit.jpg"
              }
              alt="photoURL"
              sx={{ height: 50, width: 50 }}
            />
            <Box></Box>
            <Button
              variant="outlined"
              sx={{ width: "85%", justifyContent: "flex-start" }}
              onClick={() => openDialog()}
            >
              What's on your mind, User?
            </Button>
          </Box>
          {postList?.map((post) => {
            return <FreedomWallItem post={post} Like={Like} />;
          })}
        </Box>
      </Container>

      <DialogModal
        {...dialogProps}
        title={"Creating Post"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25, position: "relatie" },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="sm"
      >
        <CreatePost onSubmit={onSubmit} />
      </DialogModal>
    </Page>
  );
}

export default FreedomWallPage;
