import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler";
import ApiError from "../../utils/apiError";

import {
  createCustomer as createCustomerService,
  listCustomers,
  getCustomerById as getCustomerByIdService,
  updateCustomer as updateCustomerService,
  addFollowUp as addFollowUpService,
} from "./customer.service";

import {
  createCustomerSchema,
  updateCustomerSchema,
  followUpSchema,
  listCustomerQuerySchema,
} from "./customer.validation";

// CREATE CUSTOMER
export const createCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const data = createCustomerSchema.parse(req.body);

    const customer = await createCustomerService(
      data,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  }
);

// GET ALL CUSTOMERS
export const getCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const query = listCustomerQuerySchema.parse(req.query);

    const result = await listCustomers(query);

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  }
);

// GET CUSTOMER BY ID
export const getCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, "Invalid customer ID");
    }

    const customer = await getCustomerByIdService(id);

    return res.status(200).json({
      success: true,
      data: customer,
    });
  }
);

// UPDATE CUSTOMER
export const updateCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, "Invalid customer ID");
    }

    const data = updateCustomerSchema.parse(req.body);

    const customer = await updateCustomerService(id, data);

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  }
);

// ADD FOLLOW-UP
export const addFollowUp = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const customerId = Number(req.params.id);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new ApiError(400, "Invalid customer ID");
    }

    const data = followUpSchema.parse(req.body);

    const followUp = await addFollowUpService(
      customerId,
      data,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Follow-up added successfully",
      data: followUp,
    });
  }
);