import { z } from "zod";

// CREATE PRODUCT
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(150, "Product name is too long"),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU is too long"),

  category: z
    .string()
    .trim()
    .max(100, "Category is too long")
    .optional()
    .or(z.literal("")),

  unitPrice: z.coerce
    .number()
    .min(0, "Unit price cannot be negative"),

  currentStock: z.coerce
    .number()
    .int("Current stock must be a whole number")
    .min(0, "Current stock cannot be negative"),

  minStock: z.coerce
    .number()
    .int("Minimum stock must be a whole number")
    .min(0, "Minimum stock cannot be negative"),

  warehouse: z
    .string()
    .trim()
    .max(150, "Warehouse name is too long")
    .optional()
    .or(z.literal("")),
});

// UPDATE PRODUCT
export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(150, "Product name is too long")
    .optional(),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU is too long")
    .optional(),

  category: z
    .string()
    .trim()
    .max(100, "Category is too long")
    .optional()
    .or(z.literal("")),

  unitPrice: z.coerce
    .number()
    .min(0, "Unit price cannot be negative")
    .optional(),

  minStock: z.coerce
    .number()
    .int("Minimum stock must be a whole number")
    .min(0, "Minimum stock cannot be negative")
    .optional(),

  warehouse: z
    .string()
    .trim()
    .max(150, "Warehouse name is too long")
    .optional()
    .or(z.literal("")),
});

// LIST PRODUCTS
export const listProductQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  search: z.string().trim().optional(),

  category: z.string().trim().optional(),

  lowStock: z.enum(["true", "false"]).optional(),
});

// STOCK MOVEMENT
export const stockMovementSchema = z.object({
  type: z.enum(["IN", "OUT"]),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be greater than 0"),

  reason: z
    .string()
    .trim()
    .max(255, "Reason is too long")
    .optional()
    .or(z.literal("")),
});

// TYPES
export type CreateProductInput = z.infer<
  typeof createProductSchema
>;

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>;

export type ListProductQuery = z.infer<
  typeof listProductQuerySchema
>;

export type StockMovementInput = z.infer<
  typeof stockMovementSchema
>;