import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../services/api";
import Loading from "../../Loading";
import type { Customer } from "../../../types";

const statusColors: Record<string, string> = {
  LEAD: "badge-lead",
  ACTIVE: "badge-active",
  INACTIVE: "badge-inactive",
};

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const load = async () => {
    const res = await api.get(`/customers/${id}`);
    setCustomer(res.data.data);
  };

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setAddingNote(true);
    try {
      await api.post(`/customers/${id}/follow-ups`, { note });
      setNote("");
      await load();
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) return <Loading label="Loading customer..." />;
  if (!customer) return <div className="empty-state">Customer not found.</div>;

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <Link to="/customers" className="breadcrumb-link">
            &larr; Back to Customers
          </Link>
          <h1>
            {customer.name}{" "}
            <span className={`badge ${statusColors[customer.status]}`}>{customer.status}</span>
          </h1>
        </div>
        <Link to={`/customers/${customer.id}/edit`} className="btn btn-primary">
          Edit Customer
        </Link>
      </div>

      <div className="detail-grid">
        <div className="card detail-card">
          <h3>Contact Information</h3>
          <dl>
            <dt>Mobile</dt>
            <dd>{customer.mobile}</dd>
            <dt>Email</dt>
            <dd>{customer.email || "—"}</dd>
            <dt>Business Name</dt>
            <dd>{customer.businessName || "—"}</dd>
            <dt>GST Number</dt>
            <dd>{customer.gstNumber || "—"}</dd>
            <dt>Address</dt>
            <dd>{customer.address || "—"}</dd>
          </dl>
        </div>

        <div className="card detail-card">
          <h3>CRM Details</h3>
          <dl>
            <dt>Type</dt>
            <dd>{customer.customerType}</dd>
            <dt>Status</dt>
            <dd>{customer.status}</dd>
            <dt>Follow-up Date</dt>
            <dd>
              {customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : "—"}
            </dd>
            <dt>Created By</dt>
            <dd>{customer.createdBy?.name || "—"}</dd>
            <dt>Notes</dt>
            <dd>{customer.notes || "—"}</dd>
          </dl>
        </div>
      </div>

      <div className="card">
        <h3>Follow-up History</h3>
        <form onSubmit={handleAddNote} className="followup-form">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a follow-up note..."
            rows={2}
          />
          <button type="submit" className="btn btn-primary" disabled={addingNote}>
            {addingNote ? "Adding..." : "Add Note"}
          </button>
        </form>

        <ul className="followup-list">
          {customer.followUps && customer.followUps.length > 0 ? (
            customer.followUps.map((f) => (
              <li key={f.id}>
                <p>{f.note}</p>
                <span className="text-muted">
                  {f.createdBy?.name || "Unknown"} · {new Date(f.createdAt).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted">No follow-up notes yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomerDetails;