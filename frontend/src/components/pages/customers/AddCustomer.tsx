import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import CustomerForm from "./CustomerForm";
import type { CustomerFormValues } from "../../../types";
import "../../../styles/customers.css";

const emptyValues: CustomerFormValues = {
  name: "",
  mobile: "",
  email: "",
  businessName: "",
  gstNumber: "",
  customerType: "RETAIL",
  address: "",
  status: "LEAD",
  followUpDate: "",
  notes: "",
};

const AddCustomer = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: CustomerFormValues) => {
    const res = await api.post("/customers", {
      ...values,
      followUpDate: values.followUpDate ? new Date(values.followUpDate).toISOString() : undefined,
    });
    navigate(`/customers/${res.data.data.id}`);
  };

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <Link to="/customers" className="breadcrumb-link">
            &larr; Back to Customers
          </Link>
          <h1>Add New Customer</h1>
        </div>
      </div>
      <div className="card">
        <CustomerForm initialValues={emptyValues} onSubmit={handleSubmit} submitLabel="Save Customer" />
      </div>
    </div>
  );
};

export default AddCustomer;