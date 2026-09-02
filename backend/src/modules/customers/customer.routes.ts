import { Router } from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  addFollowUp,
} from "./customer.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createCustomer);

router.get("/", authenticate, getCustomers);

router.get("/:id", authenticate, getCustomerById);

router.put("/:id", authenticate, updateCustomer);

router.post("/:id/followups", authenticate, addFollowUp);

export default router;