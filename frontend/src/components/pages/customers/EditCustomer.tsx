import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import CustomerForm from "./CustomerForm";
import Loading from "../../Loading";
import type { Customer, CustomerFormValues } from "../../../types";

const toFormValues = (c: Customer): CustomerFormValues => ({
  name: c.name,
  mobile: c.mobile,
  email: c.email || "",
  businessName: c.businessName || "",
  gstNumber: c.gstNumber || "",
  customerType: c.customerType,
  address: c.address || "",
  status: c.status,
  followUpDate: c.followUpDate ? c.followUpDate.slice(0, 10) : "",
  notes: c.notes || "",
});

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/customers/${id}`);
        setCustomer(res.data.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (values: CustomerFormValues) => {
    await api.put(`/customers/${id}`, {
      ...values,
      followUpDate: values.followUpDate ? new Date(values.followUpDate).toISOString() : undefined,
    });
    navigate(`/customers/${id}`);
  };

  if (loading) return <Loading label="Loading customer..." />;
  if (notFound || !customer) return <div className="empty-state">Customer not found.</div>;

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <Link to={`/customers/${id}`} className="breadcrumb-link">
            &larr; Back to Customer
          </Link>
          <h1>Edit {customer.name}</h1>
        </div>
      </div>
      <div className="card">
        <CustomerForm
          initialValues={toFormValues(customer)}
          onSubmit={handleSubmit}
          submitLabel="Update Customer"
        />
      </div>
    </div>
  );
};

export default EditCustomer;