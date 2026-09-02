import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../../services/api";
import Loading from "../../Loading";
import type { Product, StockMovement } from "../../../types";

import "../../../styles/customers.css";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const [productResponse, movementResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/stock-movements`),
        ]);

        setProduct(productResponse.data.data);
        setMovements(movementResponse.data.data || []);
      } catch (err: any) {
        console.error("Failed to load product:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="customer-page">
        <Loading label="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="customer-page">
        <div className="page-header">
          <div>
            <h1>Product Details</h1>
            <p className="text-muted">
              Unable to load this product.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="empty-state">
            {error || "Product not found"}
          </div>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isLowStock =
    product.currentStock <= product.minStock;

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <h1>{product.name}</h1>
          <p className="text-muted">
            Product and inventory details
          </p>
        </div>

        <div>
          <Link
            to="/products"
            className="btn btn-ghost"
          >
            ← Back to Products
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Product Information</h2>

        <div className="details-grid">
          <div>
            <strong>Product Name</strong>
            <p>{product.name}</p>
          </div>

          <div>
            <strong>SKU</strong>
            <p>{product.sku}</p>
          </div>

          <div>
            <strong>Category</strong>
            <p>{product.category || "—"}</p>
          </div>

          <div>
            <strong>Unit Price</strong>
            <p>
              ₹
              {Number(product.unitPrice).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div>
            <strong>Current Stock</strong>
            <p>
              <span
                className={`badge ${
                  isLowStock
                    ? "badge-lead"
                    : "badge-active"
                }`}
              >
                {product.currentStock}
              </span>
            </p>
          </div>

          <div>
            <strong>Minimum Stock</strong>
            <p>{product.minStock}</p>
          </div>

          <div>
            <strong>Warehouse</strong>
            <p>{product.warehouse || "—"}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Stock Movement History</h2>

        {movements.length === 0 ? (
          <div className="empty-state">
            No stock movements found.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Created By</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>
                      <span
                        className={`badge ${
                          movement.type === "IN"
                            ? "badge-active"
                            : "badge-lead"
                        }`}
                      >
                        {movement.type}
                      </span>
                    </td>

                    <td>{movement.quantity}</td>

                    <td>
                      {movement.reason || "—"}
                    </td>

                    <td>
                      {movement.createdBy?.name || "—"}
                    </td>

                    <td>
                      {new Date(
                        movement.createdAt
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;