import { useState } from "react";
import { Box, Typography, Tooltip, Grid, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Print } from "@mui/icons-material";
import OrderDetailsGrid from "./OrderDetailsGrid";
import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery, usePrintOrderMutation } from "./ordersApiSlice";
import ThermalReceipt from "./ThermalReceipt";
import { useEffect } from "react";

const OrderDetails = () => {
  const { id } = useParams();

  const { data: order, isLoading, isSuccess } = useGetOrderByIdQuery(id);
  const [printOrder] = usePrintOrderMutation();

  useEffect(() => {
    console.log("orderItems", order?.data?.orderItems)
    console.log("orderMeta", order?.data?.orderMeta)
  }, [])

  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = async () => {
    try {
      await printOrder(id).unwrap();
      setErrMsg("");
      setOpen(false);
    } catch (err) {
      setErrMsg(err?.data?.message);
      console.error(err);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography component="h2" variant="h5">
          Order Details
        </Typography>

        <Tooltip title="Print Receipt">
          <Button
            variant="contained"
            startIcon={<Print />}
            disabled={isLoading || !isSuccess}
            onClick={handleOpen}
          >
            Print
          </Button>
        </Tooltip>
      </Box>

      {errMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errMsg}
        </Alert>
      )}

      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={12}>
          <OrderDetailsGrid id={id} />
        </Grid>
      </Grid>

      {/* Print Preview Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle textAlign={"center"} sx={{ paddingTop: 2, fontSize: 20 }}>
          Receipt Preview
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center", // center horizontally
            alignItems: "center", // center vertically (if content smaller than height)
          }}
        >
          <Box sx={{
            p: 4,
            borderRadius: 1,
            border: '1px solid #ccc',
            boxShadow: 3,
            backgroundColor: '#fff'
          }}>
            <ThermalReceipt
              orderMeta={order?.data?.orderMeta} 
              orderItems={order?.data?.orderItems}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handlePrint} variant="contained">
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetails;
