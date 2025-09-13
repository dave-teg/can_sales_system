import { apiSlice } from "../../app/api/apiSlice";

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodaySales: builder.query({
      query: () => '/analytics/sales/today',
      transformResponse: (response) => response.data.todaySales,
    }),
    getWeeklySales: builder.query({
      query: () => '/analytics/sales/weekly',
      transformResponse: (response) => ({
        weeklySales: response.data.weeklySalesData.weeklySales.map((day) => parseInt(day.total_sales)),
        trend: response.data.weeklySalesData.trend,
        totalSales: response.data.weeklySalesData.totalSales.total_sales
      })
    }),
    getMonthlySales: builder.query({
      query: () => '/analytics/sales/monthly',
      transformResponse: (response) => ({
        monthlySales: response.data.monthlySalesData.monthlySales.map((day) => parseInt(day.total_sales)),
        monthlyOrders: response.data.monthlySalesData.monthlySales.map((day) => parseInt(day.order_count)),
        trend: response.data.monthlySalesData.trend,
        totalSales: response.data.monthlySalesData.totalSales.total_sales
      })
    }),
    getYearlySales: builder.query({
      query: () => '/analytics/sales/yearly',
      transformResponse: (response) => ({
        yearlySales: response.data.yearlySalesData.yearlySales.map((data) => parseInt(data.total_sales)),
        yearlyOrders: response.data.yearlySalesData.yearlySales.map((data) => parseInt(data.order_count)),
        salesMonth: response.data.yearlySalesData.yearlySales.map((data) => data.sales_month),
        trend: response.data.yearlySalesData.trend,
        totalSales: response.data.yearlySalesData.totalSales.total_sales
      })
    }),
    getBestSellingProducts: builder.query({
      query: () => '/analytics/products/best',
      transformResponse: (response) => response.data.map(row => {
          return {
            id: row.id,
            productName: row.name,
            price: parseInt(row.price),
            totalUnitsSold: row.total_units_sold,
            revenue: parseInt(row.total_revenue),
            dailyRevenue: row.daily_revenue_for_last_30_days
          }
      })
    })
  })
})

export const { useGetTodaySalesQuery, useGetWeeklySalesQuery, useGetMonthlySalesQuery, useGetYearlySalesQuery, useGetBestSellingProductsQuery } = analyticsApiSlice;