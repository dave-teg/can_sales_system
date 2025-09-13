import { Box, Grid, Typography, Card, Stack, CardContent } from "@mui/material";
import StatCard from "./StatCard";
import { Event } from "@mui/icons-material";
import MonthlySalesChart from "./MonthlySalesChart";
import YearlySalesBarChart from "./YearlySalesBarChart";
import BestSellingProductGrid from "./BestSellingProductGrid";
import RecentOrderGrid from "../orders/RecentOrderGrid";
import {
  useGetTodaySalesQuery,
  useGetWeeklySalesQuery,
  useGetMonthlySalesQuery,
  useGetYearlySalesQuery,
} from "./analyticsApiSlice";
import { format } from "date-fns";
import Skeleton from "@mui/material/Skeleton";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { data: todaySales, isLoading: isTodayLoading } =
    useGetTodaySalesQuery();

  const { data: weeklyData, isLoading: isWeeklyLoading } =
    useGetWeeklySalesQuery(undefined, {skip: !isAdmin});

  const { data: monthlyData, isLoading: isMonthlyLoading } =
    useGetMonthlySalesQuery(undefined, {skip: !isAdmin});
  const { isLoading: isYearlyLoading } = useGetYearlySalesQuery(undefined, {skip: !isAdmin});

  console.log("weekly data", weeklyData)
  console.log("monthly data", monthlyData)

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, mb: 4 }}>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          {isTodayLoading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={396}
              height={177}
            />
          ) : (
            <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" component="h2" gutterBottom>
                  Today's Sales
                </Typography>
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  sx={{ flexGrow: "1", height: "100%", gap: 4 }}
                >
                  <Stack sx={{ justifyContent: "space-between" }}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h4" component="p">
                        {`$${Number(todaySales.total_sales).toLocaleString(
                          "en-US",
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}`}
                      </Typography>
                      <Typography variant="h4" component="p">
                        {`${Number(todaySales.order_count).toLocaleString()}`}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" component="p">
                        Total sales
                      </Typography>
                      <Typography variant="caption" component="p">
                        Total orders
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary" }}
                  >
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Event fontSize="small" />
                      <span>{format(new Date(), "MMM dd, yyyy")}</span>
                    </Stack>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {isAdmin && (
          <>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              {isWeeklyLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={396}
                  height={177}
                />
              ) : (
                <StatCard
                  title={"Weekly Sales"}
                  value={`$${Number(weeklyData.totalSales).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}
                  interval={"Last 7 days"}
                  trend={weeklyData.trend ?? 0}
                  data={weeklyData.weeklySales}
                  daysInWeek={7}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              {isMonthlyLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={396}
                  height={177}
                />
              ) : (
                <StatCard
                  title={"Monthly Sales"}
                  value={`$${Number(monthlyData.totalSales).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}
                  interval={"Last 30 days"}
                  trend={monthlyData.trend ?? 0}
                  data={monthlyData.monthlySales}
                  daysInWeek={30}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              {isMonthlyLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={602}
                  height={372}
                />
              ) : (
                <MonthlySalesChart />
              )}
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              {isYearlyLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={602}
                  height={372}
                />
              ) : (
                <YearlySalesBarChart />
              )}
            </Grid>
          </>
        )}
      </Grid>
      <Typography component="h2" variant="h6" sx={{ my: 3 }}>
        Best Selling Products
      </Typography>
      <Grid size={12}>
        <BestSellingProductGrid />
      </Grid>
      <Typography component="h2" variant="h6" sx={{ my: 2 }}>
        Recent Orders
      </Typography>
      <Grid size={12}>
        <RecentOrderGrid />
      </Grid>
    </Box>
  );
};

export default Dashboard;
