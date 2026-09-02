import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductController,
  updateProductController,
  addStockMovementController,
  getStockMovementsController,
} from "./product.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Product APIs
router.post("/", authenticate, createProductController);

router.get("/", authenticate, getProductsController);

router.get("/:id", authenticate, getProductController);

router.put("/:id", authenticate, updateProductController);

// Inventory / Stock APIs
router.post(
  "/:id/stock",
  authenticate,
  addStockMovementController
);

router.get(
  "/:id/stock-movements",
  authenticate,
  getStockMovementsController
);

export default router;