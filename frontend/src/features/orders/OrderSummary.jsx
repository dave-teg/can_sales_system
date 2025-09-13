import { useState } from "react";
import { format } from "date-fns";
import SingleItemCard from "./SingleItemCard";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  Checkbox,
  Paper,
  Stack,
  Card,
  CardContent,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, DeleteForever, ContentCopy } from "@mui/icons-material";
import ThermalReceipt from "./ThermalReceipt";
import { usePlaceOrderMutation, usePrintOrderMutation } from "./ordersApiSlice";
import { useGetAllWaitersQuery } from "../waiters/waitersApiSlice";
import useAuth from "../../hooks/useAuth";

const capitalizeWords = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const OrderSummary = ({ cart, setCart, handleRemoveFromCart, setErrMsg }) => {
  const { data: waiters, isLoading } = useGetAllWaitersQuery();

  const [placeOrder] = usePlaceOrderMutation();
  const [printOrder] = usePrintOrderMutation();

  const [orderId, setOrderId] = useState(null);
  const [waiterId, setWaiterId] = useState("");
  const [orderMeta, setOrderMeta] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const { fullname } = useAuth();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalNoOfItems = cart.length;

  const handleWaiterChange = (event) => {
    setWaiterId(event.target.value);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    try {
      const response = await placeOrder({ cartItems: cart, waiterId }).unwrap();
      setOrderId(response.data.orderId);
      setOrderMeta(response.data.orderMetaResult);
      setOrderItems(response.data.orderItemsResult);
      setShowReceiptModal(true);
      setErrMsg("");
    } catch (err) {
      setErrMsg(err?.data?.message);
      console.log(err);
    }
  };

  const handlePrint = async () => {
    try {
      await printOrder(orderId).unwrap();
      setErrMsg("");
      setCart([]);
      setShowReceiptModal(false);
      setOrderId(null);
    } catch (err) {
      setErrMsg(err?.data?.message);
      console.error(err);
    }
  };

  const handleClose = () => {
    setShowReceiptModal(false);
    setOrderId(null);
    setCart([]);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 400,
          // height: "490px",
          height: "530px",
          borderBottom: "1px solid",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Cashier Name
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {capitalizeWords(fullname)}
            </Typography>
          </Stack>
          <Box sx={{ minWidth: 120, pt: 1, pb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="waiter-select-label">Waiter</InputLabel>
              <Select
                labelId="waiter-select-label"
                id="waiter-select"
                value={waiterId}
                label="Waiter"
                onChange={handleWaiterChange}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  waiters?.map((waiter) => (
                    <MenuItem key={waiter.id} value={waiter.id}>
                      {waiter.fullname}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {format(new Date(), "MMMM d, yyyy hh:mm a")}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ maxHeight: "300px", overflowY: "auto", flexGrow: 1 }}>
          {/* Order Details Title */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Order Details
          </Typography>

          {cart.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items in order.
            </Typography>
          ) : (
            <Stack direction="column" spacing={1.3}>
              {/* Order Items */}
              {cart.map((product) => (
                <SingleItemCard
                  key={product.id}
                  product={product}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </Stack>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Totals Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" fontWeight={700}>
            {`Total (${totalNoOfItems} ${
              totalNoOfItems === 1 ? "item" : "items"
            })`}
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            ${total.toFixed(2)}
          </Typography>
        </Stack>
        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1 }}
            disabled={cart.length === 0}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Box>

        {/* Receipt component hidden from view but available to print */}
        {/* <div
        id="thermal-receipt"
        style={{
          width: "80mm",
          fontSize: "12px",
          padding: "10px",
          fontFamily: "monospace",
          visibility: "hidden", // until print
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div ref={printRef}>
          <ThermalReceipt
            cart={cart}
            total={total}
            cashier={capitalizeWords(fullname)}
            totalNoOfItems={totalNoOfItems}
          />
        </div>
      </div> */}
      </Paper>

      {/* Receipt Preview Modal */}
      <Dialog
        open={showReceiptModal}
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
          <Box
            sx={{
              p: 4,
              borderRadius: 1,
              border: "1px solid #ccc",
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          >
            <ThermalReceipt
              cart={cart}
              total={total}
              orderMeta={orderMeta}
              orderItems={orderItems}
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
    </>
  );
};

export default OrderSummary;
