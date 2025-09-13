import asyncHandler from "express-async-handler";
import {
  getTodaySalesService,
  getWeeklySalesService,
  getMonthlySalesService,
  getSalesStatsByDateRangeService,
  getTopProductsService,
  getAllTimeOrderStatsService,
  getYearlySalesService,
  getBestSellingProductsService,
} from "../models/analyticsModel.js";

//@desc Get today's sales statistics
//@route GET /api/analytics/sales/today
//access Private/Admin
export const getTodaySales = asyncHandler(async (req, res) => {
  const todaySales = await getTodaySalesService();

  res.json({
    success: true,
    data: {
      todaySales
    },
  });
});

//@desc Get weekly sales statistics
//@route GET /api/analytics/sales/weekly
//access Private/Admin
export const getWeeklySales = asyncHandler(async (req, res) => {
  const weeklySales = await getWeeklySalesService();

  res.json({
    success: true,
    data: { weeklySalesData: weeklySales },
  });
});

//@desc Get monthly sales statistics
//@route GET /api/analytics/sales/monthly
//access Private/Admin
export const getMonthlySales = asyncHandler(async (req, res) => {
  const monthlySales = await getMonthlySalesService();
  
  res.json({
    success: true,
    data: { monthlySalesData: monthlySales },
  });
});

//@desc Get yearly sales statistics
//@route GET /api/analytics/sales/yearly
//access Private/Admin
export const getYearlySales = asyncHandler(async (req, res) => {
  const yearlySales = await getYearlySalesService();

  res.json({
    success: true,
    data: { yearlySalesData: yearlySales },
  });
});

//@desc Get top selling products
//@route GET /api/analytics/products/top
//@access Private
export const getTopProducts = asyncHandler(async (req, res) => {

  const topProducts = await getTopProductsService();

  res.json({ success: true, data: topProducts });
});

//@desc Get best selling products which includes daily revenue for the last 30 days
//@route GET /api/analytics/products/best
//@access Private
export const getBestSellingProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const products = await getBestSellingProductsService(limit);

  res.json({ success: true, data: products });
});

//@desc Get sales statistics for a specific date range
//@route GET /api/analytics/sales/range
//@access Private/Admin
export const getSalesStatsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Validate required parameters
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Both startDate and endDate parameters are required" });
  }

  // Convert to Date objects for validation
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate date formats
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Please use YYYY-MM-DD format" });
  }

  // Validate date logic
  if (start > end) {
    return res
      .status(400)
      .json({ message: "startDate must be before or equal to endDate" });
  }

  // Format dates to ISO string (YYYY-MM-DD)
  const formattedStart = start.toISOString().split("T")[0];
  const formattedEnd = end.toISOString().split("T")[0];

  // Get stats from service
  const stats = await getSalesStatsByDateRangeService(
    formattedStart,
    formattedEnd
  );

  res.json({
    success: true,
    data: {
      orderCount: stats.order_count,
      totalSales: stats.total_sales,
      averageOrderValue:
        stats.order_count > 0 ? stats.total_sales / stats.order_count : 0,
    },
  });
});

//@desc Get all time order statistics
//@route GET /api/analytics/sales/all-time
//@access Private/Admin
export const getAllTimeOrderStats = asyncHandler(async (req, res) => {
  const stats = await getAllTimeOrderStatsService();

  res.json({
    success: true,
    data: {
      orderCount: stats.order_count,
      totalRevenue: stats.total_revenue,
      averageOrderValue:
        stats.order_count > 0 ? stats.total_revenue / stats.order_count : 0,
    },
  });
});
