import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import Loading from "../../Loading";
import type { Customer, Pagination } from "../../../types";
import "../../../styles/customers.css";

const statusColors: Record<string, string> = {
  LEAD: "badge-lead",
  ACTIVE: "badge-active",
  INACTIVE: "badge-inactive",
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const load = async () => {
        setLoading(true);
        try {
          const res = await api.get("/customers", {
            params: {
              page,
              limit: 10,
              search: search || undefined,
              status: status || undefined,
              customerType: customerType || undefined,
            },
          });
          setCustomers(res.data.data);
          setPagination(res.data.pagination);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, customerType, page]);

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="text-muted">Manage leads, active accounts and follow-ups.</p>
        </div>
        <Link to="/customers/add" className="btn btn-primary">
          + Add Customer
        </Link>
      </div>

      <div className="card">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by name, mobile, email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="search-input"
          />

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            <option value="LEAD">Lead</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={customerType}
            onChange={(e) => {
              setPage(1);
              setCustomerType(e.target.value);
            }}
          >
            <option value="">All Types</option>
            <option value="RETAIL">Retail</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="DISTRIBUTOR">Distributor</option>
          </select>
        </div>

        {loading ? (
          <Loading label="Loading customers..." />
        ) : customers.length === 0 ? (
          <div className="empty-state">No customers found. Try adjusting your filters.</div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Follow-up</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="cell-primary">{c.name}</div>
                        <div className="text-muted cell-sub">{c.businessName || c.email || ""}</div>
                      </td>
                      <td>{c.mobile}</td>
                      <td>{c.customerType}</td>
                      <td>
                        <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
                      </td>
                      <td>{c.followUpDate ? new Date(c.followUpDate).toLocaleDateString() : "—"}</td>
                      <td className="cell-actions">
                        <Link to={`/customers/${c.id}`} className="btn btn-ghost btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
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
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page >= pagination.totalPages}
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

export default Customers;