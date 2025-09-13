import { Router } from "express";
import {getAllProducts, createProduct, updateProduct, deactivateProduct} from "../controllers/productController.js"
import verifyJWT from "../middleware/verifyJWT.js"
import verifyAdmin from "../middleware/verifyAdmin.js"


const router = Router();

router.use(verifyJWT)

router.get("/", getAllProducts)
router.post("/", createProduct)
router.patch("/:id", verifyAdmin, updateProduct)
router.patch("/deactivate/:id", deactivateProduct)

export default router;