import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import OrderHistoryGrid from "./OrderHistoryGrid";
import MyOrdersGrid from "./MyOrdersGrid";
import useAuth from "../../hooks/useAuth";

const OrderPage = () => {
  const { isAdmin } = useAuth();
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
        maxWidth: { sm: "100%", md: "1300px" },
      }}
    >
      {isAdmin && (
        <>
          <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
            All Time Order History
          </Typography>
          <Grid
            container
            spacing={2}
            columns={12}
            sx={{ mb: (theme) => theme.spacing(4) }}
          >
            <Grid size={12}>
              <OrderHistoryGrid />
            </Grid>
          </Grid>
        </>
      )}

      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        My Orders
      </Typography>
      <Grid size={12} sx={{ mb: 5 }}>
        <MyOrdersGrid />
      </Grid>
    </Box>
  );
};

export default OrderPage;
