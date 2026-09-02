export type Role =
  "ADMIN" |
  "SALES" |
  "WAREHOUSE" |
  "ACCOUNTS";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type CustomerType =
  "RETAIL" |
  "WHOLESALE" |
  "DISTRIBUTOR";

export type CustomerStatus =
  "LEAD" |
  "ACTIVE" |
  "INACTIVE";

export interface FollowUp {
  id: number;
  note: string;
  createdAt: string;
  createdBy?: {
    id: number;
    name: string;
  } | null;
}

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  email?: string | null;
  businessName?: string | null;
  gstNumber?: string | null;
  customerType: CustomerType;
  address?: string | null;
  status: CustomerStatus;
  followUpDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    name: string;
  } | null;
  followUps?: FollowUp[];
}

export interface CustomerFormValues {
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber: string;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate: string;
  notes: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
}

// =========================
// PRODUCT
// =========================

export interface Product {
  id: number;
  name: string;
  sku: string;
  category?: string | null;
  unitPrice: number | string;
  currentStock: number;
  minStock: number;
  warehouse?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =========================
// STOCK MOVEMENT
// =========================

export type StockMovementType = "IN" | "OUT";

export interface StockMovement {
  id: number;
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason?: string | null;
  createdAt: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
    role: Role;
  } | null;
}