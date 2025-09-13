import { Router } from "express";
import {getAllOrders, getMyOrders, getOrderItemsForOrder, getRecentOrders, placeOrder, getOrderById} from "../controllers/orderController.js"
import verifyJWT from "../middleware/verifyJWT.js"
import verifyAdmin from "../middleware/verifyAdmin.js"


const router = Router();

router.use(verifyJWT)

router.get("/", verifyAdmin, getAllOrders)
router.get("/my-orders", getMyOrders)
router.get("/:orderId/items", getOrderItemsForOrder)
router.get("/recent", getRecentOrders)
router.get("/:orderId", getOrderById)
router.post("/", placeOrder)

export default router;