import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../../services/api";
import Loading from "../../Loading";
import type { Product, Pagination } from "../../../types";

import "../../../styles/customers.css";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadProducts = async () => {
        setLoading(true);

        try {
          const res = await api.get("/products", {
            params: {
              page,
              limit: 10,
              search: search || undefined,
              category: category || undefined,
              lowStock: lowStock ? "true" : undefined,
            },
          });

          setProducts(res.data.data);
          setPagination(res.data.pagination);
        } catch (error) {
          console.error("Failed to load products:", error);
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, lowStock, page]);

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="text-muted">
            Manage products, inventory and stock levels.
          </p>
        </div>

        <Link to="/products/add" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="card">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by product name, SKU, category..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="search-input"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          />

          <label>
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => {
                setPage(1);
                setLowStock(e.target.checked);
              }}
            />{" "}
            Low Stock
          </label>
        </div>

        {loading ? (
          <Loading label="Loading products..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            No products found. Try adjusting your filters.
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Warehouse</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const isLowStock =
                      product.currentStock <= product.minStock;

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="cell-primary">
                            {product.name}
                          </div>
                        </td>

                        <td>{product.sku}</td>

                        <td>{product.category || "—"}</td>

                        <td>
                          ₹
                          {Number(product.unitPrice).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              isLowStock
                                ? "badge-lead"
                                : "badge-active"
                            }`}
                          >
                            {product.currentStock}
                          </span>
                        </td>

                        <td>{product.warehouse || "—"}</td>

                        <td className="cell-actions">
                          <Link
                            to={`/products/${product.id}`}
                            className="btn btn-ghost btn-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  className="btn btn-ghost btn-sm"
                  disabled={
                    page >= pagination.totalPages
                  }
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;