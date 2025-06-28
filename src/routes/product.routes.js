import { Router } from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import productController from "../controllers/product.controller.js"

const router = Router()

router.post("/", protectRoute, productController.createProduct)
router.get("/", productController.getAllProduct)
router.get("/new", productController.getAllNewProduct)
router.get("/:id", productController.getOneProduct)
router.put("/:id", protectRoute, productController.updateProduct)
router.delete("/:id", protectRoute, productController.deleteProduct)

export default router