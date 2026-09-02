import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { Customer } from "../../types";
import "../../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, leads: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/customers", { params: { limit: 100 } });
        const customers: Customer[] = res.data.data;
        setStats({
          total: res.data.pagination?.total ?? customers.length,
          leads: customers.filter((c) => c.status === "LEAD").length,
          active: customers.filter((c) => c.status === "ACTIVE").length,
          inactive: customers.filter((c) => c.status === "INACTIVE").length,
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted">Here's a quick snapshot of your CRM.</p>
        </div>
        <Link to="/customers/add" className="btn btn-primary">
          + New Customer
        </Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{loading ? "—" : stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Leads</span>
          <span className="stat-value">{loading ? "—" : stats.leads}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <span className="stat-value">{loading ? "—" : stats.active}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{loading ? "—" : stats.inactive}</span>
        </div>
      </div>

      <div className="dashboard-panel">
        <h2>Quick Links</h2>
        <div className="quick-links">
          <Link to="/customers" className="quick-link-card">
            <span className="quick-link-icon">👥</span>
            <div>
              <strong>Manage Customers</strong>
              <p>Search, add and follow up on leads &amp; accounts.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;