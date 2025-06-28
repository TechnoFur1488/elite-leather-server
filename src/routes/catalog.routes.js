import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import catalogController from "../controllers/catalog.controller.js";

const router = Router()

router.post("/", protectRoute, catalogController.createCatalog)
router.get("/", catalogController.getAllCatalog)
router.get("/:id", catalogController.getProductsCatalogNew)
router.put("/:id", protectRoute, catalogController.updateCatalog)
router.delete("/:id", protectRoute, catalogController.deleteCatalog)

export default router