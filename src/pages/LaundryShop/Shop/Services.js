import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Card,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Stack,
  Tooltip,
  Grid,
  IconButton,
} from "@mui/material";
import _ from "lodash";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import DialogModal, { useDialog } from "../../../components/DialogModal";
import ServicesForm from "../../../components/pages/shop/services/ServicesForm";
// api
import servicesApi from "../../../lib/services/servicesApi";
// reducer
import { setService } from "../../../store/slice/ServiceSlice";

function Services(_props) {
  const [open, openDialog, dialogProps, setOpen, handleClose] = useDialog();
  const { shop } = useSelector((store) => store.shop);
  const { getShopServices, deleteServices } = servicesApi;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    data: servicesData,
    status: servicesStatus,
    isLoading: servicesIsLoading,
    isFetching: servicesIsFetching,
  } = useQuery(
    ["get-all-shop-services", shop?.id],
    () => getShopServices(shop?.id),
    {
      retry: 3, // Will retry failed requests 10 times before displaying an error
    }
  );

  const { mutate: DeleteService, isLoading: isLoad } = useMutation((id) => deleteServices(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get-all-shop-services']);
      toast.success('Deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const onDeleteHandler = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteService(id)
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    })
  }

  return (
    <Card style={{ height: 485, overflow: "auto" }}>
      <CardContent>
        <Typography variant="h6">
          {`${
            shop?.shop_name
              ? shop?.shop_name?.charAt(0).toUpperCase() +
                shop?.shop_name?.slice(1)
              : ""
          } Services List`}
        </Typography>
        <Typography variant="caption">
          Services created will be listed here
        </Typography>
      </CardContent>
      <Tooltip title={`Add service`}>
        <Button
          style={{ position: "absolute", right: 20, top: 20 }}
          onClick={() => {
            openDialog();
          }}
        >
          <Iconify
            icon="material-symbols:add-box-outline"
            width={30}
            height={30}
          />
        </Button>
      </Tooltip>
      <List dense>
        <Scrollbar>
          {_.isNull(servicesData?.data) ||
          _.isUndefined(servicesData?.data) ||
          _.isEmpty(servicesData?.data) ? (
            <Box
              style={{
                margin: "auto",
                marginTop: 50,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {servicesIsLoading ? (
                <CircularProgress />
              ) : (
                <Card
                  style={{ width: "80%", height: 150, textAlign: "center" }}
                  variant="outlined"
                >
                  <Typography
                    style={{ padding: 15, marginTop: 15, fontSize: 14 }}
                  >
                    You don't have any laundry services yet.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      openDialog();
                    }}
                  >
                    Add Service
                  </Button>
                </Card>
              )}
            </Box>
          ) : (
            servicesData.data?.map((data, index) => (
              <ListItem>
                <ListItemButton sx={{}}>
                  <Grid
                    container
                    justifyContent="space-between"
                    direction="row"
                    spacing={1}
                  >
                    <Grid>
                      <Stack>
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={() =>{onDeleteHandler(data.id)}}>
                            <Iconify
                              icon="material-symbols:delete-outline-rounded"
                              width={30}
                              height={30}
                              color="#FF3333"
                            />
                          </IconButton>
                          <Tooltip
                            key={index}
                            title={`Manage service`}
                            onClick={() => {
                              openDialog();
                              dispatch(setService(data));
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontSize: 16 }}
                            >
                              {data.service_name || "Service name"}
                            </Typography>
                            
                          </Tooltip>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: 14, marginLeft: 7, marginTop: -3 }}
                          >
                            Price: ₱{data.price || "0.00"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            ))
          )}
        </Scrollbar>
      </List>

      <DialogModal
        {...dialogProps}
        title={"Creating new Laundry Service"}
        styles={{
          div: { textAlign: "center" },
          title: { fontSize: 25 },
          subtitle: { fontSize: 24, fontWeight: "bold" },
        }}
        width="xs"
      >
        <ServicesForm handleClose={handleClose} />
      </DialogModal>
    </Card>
  );
}

export default Services;
