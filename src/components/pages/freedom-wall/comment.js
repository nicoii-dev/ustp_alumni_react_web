import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { capitalize } from "lodash";
import IconButton from "@mui/material/IconButton";
import { getLocalStorageItem } from "../../../lib/util/getLocalStorage";
import commentApi from "../../../lib/services/commentApi";
import { useQueryClient, useMutation } from "react-query";
import Iconify from "../../Iconify";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { yellow } from "@mui/material/colors";
import { setComment } from "../../../store/slice/CommentSlice";

export default function Comment({ data }) {
  const dispatch = useDispatch();
  const { commentData } = useSelector((store) => store.comment);
  const userData = getLocalStorageItem("userData");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const open = Boolean(anchorEl);
  const { updateComment, deleteComment } = commentApi;
  const queryClient = useQueryClient();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: Update, isLoading: updateIsLoading } = useMutation(
    (id) => updateComment(id, { post_id: data.post_id, comment: commentData }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-comments"]);
        setIsUpdate(false);
      },
      onError: (data) => {
        console.log(data);
        toast.error(data.response.data.message);
      },
    }
  );

  const { mutate: Delete } = useMutation((id) => deleteComment(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["get-all-comments"]);
    },
    onError: (data) => {
      console.log(data);
      toast.error(data.response.data.message);
    },
  });

  return (
    <List sx={{ width: "100%", maxWidth: "95%", bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: yellow[700] }} aria-label="recipe">
            {capitalize(data.comment_owner?.first_name.charAt(0))}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            data.comment_owner.first_name === "admin"
              ? "Admin"
              : `${capitalize(data.comment_owner.first_name)} ${capitalize(
                  data.comment_owner.middle_name
                )} ${capitalize(data.comment_owner.last_name)}`
          }
          primaryTypographyProps={{ fontWeight: "medium" }}
          secondary={
            <React.Fragment>
              {isUpdate ? (
                <Box
                  sx={{
                    backgroundColor: "#F5F5F5",
                    position: "sticky",
                    bottom: 0,
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                    padding: 2,
                    gap: 1,
                  }}
                >
                  <TextField
                    name="comment"
                    placeholder="Write a comment..."
                    onChange={(e) => dispatch(setComment(e.target.value))}
                    multiline={99}
                    style={{
                      width: "93%",
                      alignSelf: "center",
                      backgroundColor: "white",
                      marginBottom: 10,
                      borderRadius: 5,
                    }}
                    value={commentData}
                  />
                  <IconButton onClick={() => Update(data.id)}>
                    <Iconify
                      icon="iconamoon:send-fill"
                      sx={{ alignSelf: "center" }}
                      width={30}
                      height={30}
                    />
                  </IconButton>
                </Box>
              ) : (
                <Typography>{` — ${data.comment}`}</Typography>
              )}
              {/* <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Ali Connors
              </Typography> */}
            </React.Fragment>
          }
        />
        {data.user_id === userData.id ? (
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
                onClick={async () => {
                  handleClose();
                  setIsUpdate(true);
                  await dispatch(setComment(data.comment));
                }}
              >
                Update
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  Delete(data.id);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        ) : null}
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
