import React from "react";
import { Card, Box, Typography, Divider } from "@mui/material";
import { Event, ListAlt, Paid } from "@mui/icons-material";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const CardDemo = () => {
  return (
    <Card elevation={3} sx={{ p: 3, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Date Section */}
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Event color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Today's Date
          </Typography>
          <Typography variant="h5">
            {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        {/* Orders Section */}
        <Box
          sx={{
            textAlign: "center",
            flex: 1,
            borderLeft: 1,
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <ListAlt color="success" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Order Count
          </Typography>
          <Typography variant="h5">42</Typography>
        </Box>

        {/* Sales Section */}
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Paid color="warning" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Total Sales
          </Typography>
          <Typography variant="h5">$1,248.50</Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Mini Chart (Optional) */}
      <Box sx={{ height: 100 }}>
        <SparkLineChart data={[120, 340, 275, 513]} curve="natural" area />
      </Box>
    </Card>
  );
};

export default CardDemo;
