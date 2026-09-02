import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";

import Customers from "./components/pages/customers/Customers";
import AddCustomer from "./components/pages/customers/AddCustomer";
import EditCustomer from "./components/pages/customers/EditCustomer";
import CustomerDetails from "./components/pages/customers/CustomerDetails";

import Products from "./components/pages/products/Products";
import ProductDetails from "./components/pages/products/ProductDetails";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route
              path="/customers/:id/edit"
              element={<EditCustomer />}
            />

            <Route path="/products" element={<Products />} />
            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;