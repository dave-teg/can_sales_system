import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { useGetYearlySalesQuery } from './analyticsApiSlice';



function convertToMonthShortNames(salesMonth) {
  return salesMonth.map(monthStr => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1); // month is 0-based
    return date.toLocaleString("en-US", { month: "short" }); // e.g., Jan, Feb
  });
}

export default function YearlySalesBarChart() {
  const {data: yearlyData} = useGetYearlySalesQuery()

  const theme = useTheme();
  const colorPalette = [
    // (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  let trendLabel;
  const trend = yearlyData.trend ?? 0
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
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Yearly Sales Chart
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {`$${Number(yearlyData.totalSales).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            </Typography>
            <Chip size="small" color={color} label={trendValue > 0 ? `+${trendValue}%` : `${trendValue}%`}/>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sales and Order Count per day for the last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              /* data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], */
              data: convertToMonthShortNames(yearlyData.salesMonth),
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'sales',
              label: 'Sales',
              /* data: [2234, 3872, 2998, 4125, 3357, 4789, 2998, 2234, 3872, 2998, 4125, 3357], */
              data: yearlyData.yearlySales,
              stack: 'A',
            },
            {
              id: 'orders',
              label: 'Orders',
              /* data: [3098, 4215, 2384, 2101, 4752, 3593, 2384, 3098, 4215, 2384, 2101, 4752], */
              data: yearlyData.yearlyOrders,
              stack: 'A',
            }
          ]}
          height={250}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
