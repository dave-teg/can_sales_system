import { Router } from "express";
import {getAllUsers, updateUser, deactivateUser} from "../controllers/userController.js"
import verifyJWT from "../middleware/verifyJWT.js"
import verifyAdmin from "../middleware/verifyAdmin.js"


const router = Router();

router.use(verifyJWT)
router.use(verifyAdmin)

router.get("/", getAllUsers)
router.patch("/:id", updateUser)
router.patch("/deactivate/:id", deactivateUser)

export default router;