import { Request, Response } from "express";

import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  addStockMovement,
  listStockMovements,
} from "./product.service";

import {
  createProductSchema,
  updateProductSchema,
  listProductQuerySchema,
  stockMovementSchema,
} from "./product.validation";

// CREATE PRODUCT
export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = createProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const product = await createProduct(
      validation.data,
      Number(userId)
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(error?.statusCode || 500).json({
      success: false,
      message:
        error?.message || "Internal server error",
    });
  }
};

// GET ALL PRODUCTS
export const getProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = listProductQuerySchema.safeParse(
      req.query
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const result = await listProducts(
      validation.data
    );

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(error?.statusCode || 500).json({
      success: false,
      message:
        error?.message || "Internal server error",
    });
  }
};

// GET PRODUCT BY ID
export const getProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("GET PRODUCT ERROR:", error);

    return res.status(error?.statusCode || 500).json({
      success: false,
      message:
        error?.message || "Internal server error",
    });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const validation = updateProductSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const product = await updateProduct(
      id,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(error?.statusCode || 500).json({
      success: false,
      message:
        error?.message || "Internal server error",
    });
  }
};

// ADD STOCK MOVEMENT
export const addStockMovementController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const validation = stockMovementSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await addStockMovement(
      productId,
      validation.data,
      Number(userId)
    );

    return res.status(200).json({
      success: true,
      message: `Stock ${validation.data.type} movement added successfully`,
      data: result,
    });
  } catch (error: any) {
    console.error(
      "ADD STOCK MOVEMENT ERROR:",
      error
    );

    return res.status(error?.statusCode || 500).json({
      success: false,
      message:
        error?.message || "Internal server error",
    });
  }
};

// GET STOCK MOVEMENTS
export const getStockMovementsController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const movements = await listStockMovements(
      productId
    );

    return res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error: any) {
    console.error(
      "GET STOCK MOVEMENTS ERROR:",
      error
    );

    return res.status(error?.statusCode || 500).json({
      success: false,
      message:
        error?.message || "Internal server error",
    });
  }
};