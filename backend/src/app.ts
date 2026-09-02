import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import customerRoutes from "./modules/customers/customer.routes";
import productRoutes from "./modules/products/product.routes";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5176",
      "http://localhost:5177",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Mini ERP CRM API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;