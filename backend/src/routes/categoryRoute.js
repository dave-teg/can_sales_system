import { Router } from "express";
import {getAllCategories, createCategory, updateCategory, deactivateCategory} from "../controllers/categoryController.js"
import verifyJWT from "../middleware/verifyJWT.js"


const router = Router();

router.use(verifyJWT)

router.get("/", getAllCategories)
router.post("/", createCategory)
router.patch("/:id", updateCategory)
router.patch("/deactivate/:id", deactivateCategory)

export default router;