import { Router } from "express";
import {getTodaySales, getWeeklySales, getMonthlySales, getTopProducts, getSalesStatsByDateRange, getAllTimeOrderStats, getYearlySales, getBestSellingProducts} from "../controllers/analyticsController.js"
import verifyJWT from "../middleware/verifyJWT.js"
import verifyAdmin from "../middleware/verifyAdmin.js"


const router = Router();

router.use(verifyJWT)

router.get("/sales/today", getTodaySales)
router.get("/sales/weekly", verifyAdmin, getWeeklySales)
router.get("/sales/monthly", verifyAdmin, getMonthlySales)
router.get("/sales/yearly", verifyAdmin, getYearlySales)
router.get("/sales/range", verifyAdmin, getSalesStatsByDateRange)
router.get("/sales/all-time", verifyAdmin, getAllTimeOrderStats)
router.get("/products/top", getTopProducts)
router.get("/products/best", getBestSellingProducts)

export default router;