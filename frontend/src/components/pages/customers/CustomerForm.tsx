import { useState } from "react";
import type { FormEvent } from "react";
import type { CustomerFormValues } from "../../../types";

interface CustomerFormProps {
  initialValues: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  submitLabel: string;
}

// Shared form used by both AddCustomer and EditCustomer so the two
// pages never drift out of sync on fields/validation.
const CustomerForm = ({ initialValues, onSubmit, submitLabel }: CustomerFormProps) => {
  const [values, setValues] = useState<CustomerFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const update = (field: keyof CustomerFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors.name = "Customer name is required";
    if (!values.mobile.trim()) nextErrors.mobile = "Mobile number is required";
    else if (!/^[0-9+\-\s]{7,15}$/.test(values.mobile))
      nextErrors.mobile = "Enter a valid mobile number";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email))
      nextErrors.email = "Enter a valid email";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">
          <label>
            Customer Name*
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Ramesh Traders"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Mobile Number*
            <input
              value={values.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              placeholder="e.g. 9876543210"
            />
            {errors.mobile && <span className="field-error">{errors.mobile}</span>}
          </label>

          <label>
            Email
            <input
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@business.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Business Name
            <input
              value={values.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="e.g. Ramesh Wholesale Traders"
            />
          </label>

          <label>
            GST Number
            <input
              value={values.gstNumber}
              onChange={(e) => update("gstNumber", e.target.value)}
              placeholder="Optional"
            />
          </label>

          <label>
            Customer Type
            <select
              value={values.customerType}
              onChange={(e) => update("customerType", e.target.value)}
            >
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Status &amp; Follow-up</h3>
        <div className="form-grid">
          <label>
            Status
            <select value={values.status} onChange={(e) => update("status", e.target.value)}>
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <label>
            Follow-up Date
            <input
              type="date"
              value={values.followUpDate}
              onChange={(e) => update("followUpDate", e.target.value)}
            />
          </label>

          <label className="span-2">
            Address
            <textarea
              value={values.address}
              onChange={(e) => update("address", e.target.value)}
              rows={2}
              placeholder="Full address"
            />
          </label>

          <label className="span-2">
            Notes
            <textarea
              value={values.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Any additional notes"
            />
          </label>
        </div>
      </div>

      {formError && <div className="form-error">{formError}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;