import { Router } from "express";
import { printReciept } from "../controllers/printController.js";
import verifyJWT from "../middleware/verifyJWT.js"


const router = Router();

router.use(verifyJWT)

router.post("/:orderId", printReciept)

export default router;