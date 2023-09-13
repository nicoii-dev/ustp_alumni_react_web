// @mui
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import { Card, IconButton, Typography, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
// utils
// components
import Iconify from "../../../../components/Iconify";
import { setShop } from "../../../../store/slice/ShopSlice";
import DialogModal, { useDialog } from "../../../DialogModal";
import ShopUpdateForm from "../../../pages/shop/ShopUpdateForm";
import { removeShop } from "../../../../store/slice/ShopSlice";
// api
import shopApi from "../../../../lib/services/shopApi";

// ----------------------------------------------------------------------

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  sx,
  ...other
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { deleteShop } = shopApi;
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();

  const { mutate: DeleteShop, isLoading: isLoad } = useMutation(
    (id) => deleteShop(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["get-all-user-shops"]);
        dispatch(removeShop())
        toast.success("Deleted successfully.");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const onDeleteHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteShop(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    });
  };

  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: "center",
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle>
        <Tooltip title={`View Shop`}>
          <IconButton
            onClick={() => {
              dispatch(setShop(other.data));
            }}
          >
            <Iconify icon={"mdi:shop-location"} width={35} height={35} />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Update Shop`}>
          <IconButton
            onClick={() => {
              dispatch(setShop(other.data));
              openDialog();
            }}
          >
            <Iconify icon={"mdi:shop-edit"} width={35} height={35} />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Delete Shop`}>
          <IconButton
            onClick={() => {
              onDeleteHandler(other.data.id);
            }}
          >
            <Iconify icon={"mdi:shop-off"} width={35} height={35} />
          </IconButton>
        </Tooltip>
      </IconWrapperStyle>

      <Typography variant="subtitle2" sx={{ fontSize: 20 }}>
        {title}
      </Typography>

      <DialogModal
        {...dialogProps}
        title={
          "Updating " +
          other.data.shop_name.charAt(0).toUpperCase() +
          other.data.shop_name.slice(1)
        }
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25 },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="md"
      >
        <ShopUpdateForm handleClose={handleClose} />
      </DialogModal>
    </Card>
  );
}
