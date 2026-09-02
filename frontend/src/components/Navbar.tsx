import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-title">Mini ERP · CRM Operations Portal</div>
      <div className="navbar-user">
        <div className="user-badge">
          <span className="user-name">{user?.name}</span>
          {user && (
            <span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;