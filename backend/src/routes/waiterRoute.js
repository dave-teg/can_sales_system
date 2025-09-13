import { Router } from "express";
import {getAllWaiters, updateWaiter, createWaiter, deactivateWaiter, getWaiterById} from "../controllers/waiterController.js"
import verifyJWT from "../middleware/verifyJWT.js"

const router = Router();

router.use(verifyJWT)

router.get("/", getAllWaiters)
router.get("/:id", getWaiterById)
router.patch("/:id", updateWaiter)
router.patch("/deactivate/:id", deactivateWaiter)
router.post("/", createWaiter)

export default router;