import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { useGetMonthlySalesQuery } from "./analyticsApiSlice";

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};


function getLast30Days() {
  const days = [];
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  for (let i = 30; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(dateFormatter.format(date));
  }

  return days;
}


export default function MonthlySalesChart() {
  const { data: monthlyData } = useGetMonthlySalesQuery();

  const theme = useTheme();
  const data = getLast30Days();


  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  let trendLabel;
  const trend = monthlyData.trend ?? 0
  const trendValue = Math.trunc(trend);

  if (trendValue > 5) {
    trendLabel = "up";
  } else if (trendValue >= 0 && trendValue <= 5) {
    trendLabel = "neutral";
  } else if (trendValue < 0) {
    trendLabel = "down";
  }

  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };

  const color = labelColors[trendLabel];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Monthly Sales Chart
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {`$${Number(monthlyData.totalSales).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            </Typography>
            <Chip
              size="small"
              color={color}
              label={trendValue > 0 ? `+${trendValue}%` : `${trendValue}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Sales and Order Count per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: "orders",
              label: "Orders",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: monthlyData.monthlyOrders
            },
            {
              id: "sales",
              label: "Sales",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: monthlyData.monthlySales
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-sales": {
              fill: "url('#sales')",
            },
            "& .MuiAreaElement-series-orders": {
              fill: "url('#orders')",
            },
          }}
          hideLegend
        >
          {/* <AreaGradient color={theme.palette.primary.dark} id="organic" /> */}
          <AreaGradient color={theme.palette.primary.main} id="sales" />
          <AreaGradient color={theme.palette.primary.light} id="orders" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
