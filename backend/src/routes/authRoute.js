import { Router } from "express";
import {registerUser, loginUser, refresh, logout} from "../controllers/authController.js"


const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/refresh", refresh)
router.post("/logout", logout)

export default router;