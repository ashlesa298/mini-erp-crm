import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../../services/api";
import "../../../styles/customers.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unitPrice: "",
    currentStock: "",
    minStock: "",
    warehouse: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.sku.trim() ||
      form.unitPrice === "" ||
      form.currentStock === "" ||
      form.minStock === ""
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/products", {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category.trim() || null,
        unitPrice: Number(form.unitPrice),
        currentStock: Number(form.currentStock),
        minStock: Number(form.minStock),
        warehouse: form.warehouse.trim() || null,
      });

      navigate("/products");
    } catch (err: unknown) {
      console.error("Failed to create product:", err);

      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object"
          ? (
              (err as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }).response?.data?.message || "Failed to create product."
            )
          : "Failed to create product.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <h1>Add Product</h1>
          <p className="text-muted">
            Add a new product and its initial inventory.
          </p>
        </div>

        <Link to="/products" className="btn btn-ghost">
          ← Back to Products
        </Link>
      </div>

      <div className="card">
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. LAP-001"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
              />
            </div>

            <div className="form-group">
              <label>Unit Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label>Current Stock *</label>
              <input
                type="number"
                min="0"
                name="currentStock"
                value={form.currentStock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
              />
            </div>

            <div className="form-group">
              <label>Minimum Stock *</label>
              <input
                type="number"
                min="0"
                name="minStock"
                value={form.minStock}
                onChange={handleChange}
                placeholder="Alert quantity"
              />
            </div>

            <div className="form-group">
              <label>Warehouse</label>
              <input
                type="text"
                name="warehouse"
                value={form.warehouse}
                onChange={handleChange}
                placeholder="e.g. Main Warehouse"
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/products" className="btn btn-ghost">
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;