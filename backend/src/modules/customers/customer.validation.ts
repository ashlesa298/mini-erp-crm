import { z } from "zod";

export const customerTypeEnum = z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]);
export const customerStatusEnum = z.enum(["LEAD", "ACTIVE", "INACTIVE"]);

// Converts "" / undefined to undefined so optional date fields don't fail parsing.
const optionalDate = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.date().optional()
);

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  businessName: z.string().optional().or(z.literal("")),
  gstNumber: z.string().optional().or(z.literal("")),
  customerType: customerTypeEnum.default("RETAIL"),
  address: z.string().optional().or(z.literal("")),
  status: customerStatusEnum.default("LEAD"),
  followUpDate: optionalDate,
  notes: z.string().optional().or(z.literal("")),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const followUpSchema = z.object({
  note: z.string().trim().min(2, "Note is too short"),
});

export const listCustomerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: customerStatusEnum.optional(),
  customerType: customerTypeEnum.optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type FollowUpInput = z.infer<typeof followUpSchema>;
export type ListCustomerQuery = z.infer<typeof listCustomerQuerySchema>;