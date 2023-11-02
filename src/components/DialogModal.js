import React from "react";
import { useDispatch } from "react-redux";
// material
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import Iconify from "./Iconify";

export const useDialog = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const openDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const props = {
    open,
    handleClose,
  };
  return [open, openDialog, props, setOpen, handleClose];
};

const DialogModal = ({
  open,
  handleClose,
  title,
  subtitle,
  children,
  styles,
  width,
}) => (
  <Dialog
    open={open}
    // onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    fullWidth
    maxWidth={width || "sm"}
  >
    <div style={styles?.div}>
      <DialogTitle id="alert-dialog-title" style={styles?.title}>
        {title}
        <Typography style={styles?.subtitle}>{subtitle}</Typography>
        <IconButton sx={{position: "absolute", top: 1, right: 1 }} onClick={() => handleClose()}>
          <Iconify
            icon="carbon:close-filled"
            sx={{ color: "#A0A0A0"}}
            width={30}
            height={30}
          />
        </IconButton>

        <div
          style={{ width: "100%", height: 1, backgroundColor: "#A0A0A0" }}
        ></div>
      </DialogTitle>
      <DialogContent>
        <Box>{children}</Box>
      </DialogContent>
    </div>
  </Dialog>
);

export default DialogModal;
