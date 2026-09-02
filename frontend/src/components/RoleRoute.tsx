import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface RoleRouteProps {
  allowed: Role[];
}

// Wrap a set of routes to restrict them to specific roles.
// Usage: <Route element={<RoleRoute allowed={["ADMIN"]} />}>...</Route>
const RoleRoute = ({ allowed }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleRoute;