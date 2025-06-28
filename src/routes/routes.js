import { Router } from "express"
import userRoutes from "./user.routes.js"
import productRoutes from "./product.routes.js"
import catalogRoutes from "./catalog.routes.js"
import cartRoutes from "./cart.routes.js"
import orderRoutes from "./order.routes.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = Router()

router.use("/user", userRoutes)
router.use("/products", productRoutes)
router.use("/catalog", catalogRoutes)
router.use("/cart", protectRoute, cartRoutes)
router.use("/order", protectRoute, orderRoutes)

export default router